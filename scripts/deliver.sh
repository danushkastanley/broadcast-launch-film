#!/bin/bash
# Make a social upload copy from the 60fps master: H.264 High, CRF 19 capped at 16 Mbps (grain is
# expensive; uncapped it runs ~35 Mbps), faststart; audio normalised in two passes to -14 LUFS
# integrated, then limited to -1.5 dB peak.
#   deliver.sh <master.mp4> <out.mp4>
set -euo pipefail
in="$1"; out="$2"
[ -f "$in" ] || { echo "no master at $in" >&2; exit 1; }
# Case-insensitive filesystems treat Foo.mp4 and foo.mp4 as one file: never write over the master.
lower() { echo "$(cd "$(dirname "$1")" && pwd)/$(basename "$1")" | tr 'A-Z' 'a-z'; }
[ "$(lower "$in")" != "$(lower "$out")" ] || { echo "output would overwrite the master" >&2; exit 1; }

STATS=$(ffmpeg -hide_banner -nostats -i "$in" -vn -af loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json -f null - 2>&1)
filter=$(STATS="$STATS" python3 - <<'EOF'
import json, os, re
d = json.loads(re.findall(r"\{[^{}]*\}", os.environ["STATS"], re.S)[-1])
print("loudnorm=I=-14:TP=-1.5:LRA=7"
      f":measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}"
      f":measured_thresh={d['input_thresh']}:offset={d['target_offset']}:linear=true")
EOF
)

fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$in")
ffmpeg -y -hide_banner -loglevel error -nostats -i "$in" \
  -c:v libx264 -preset medium -crf 19 -maxrate 16M -bufsize 32M -pix_fmt yuv420p -profile:v high -r "$fps" -movflags +faststart \
  -af "$filter,alimiter=limit=0.84:level=false" -ar 48000 -c:a aac -b:a 256k "$out"

ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate -show_entries format=duration,size -of compact "$out"
ffmpeg -hide_banner -nostats -i "$out" -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E "I:|Peak:"
