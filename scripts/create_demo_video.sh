#!/bin/bash
# Simple helper to build a demo video for social media
# Usage: ./scripts/create_demo_video.sh screenshot.png audio.mp3
# Requires ffmpeg installed
set -e
IMG=$1
AUDIO=$2
if [ -z "$IMG" ] || [ -z "$AUDIO" ]; then
  echo "Usage: $0 <image> <audio>"
  exit 1
fi
ffmpeg -y -loop 1 -i "$IMG" -i "$AUDIO" -c:v libx264 -t 30 -pix_fmt yuv420p -vf "scale=1080:-2" demo.mp4
