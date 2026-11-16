#!/bin/sh
cd "$(dirname "$0")" || exit 1
PORT=8765
while [ "$PORT" -le 8785 ]; do
  if ! (command -v lsof >/dev/null 2>&1 && lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1); then break; fi
  PORT=$((PORT+1))
done
if [ "$PORT" -gt 8785 ]; then echo "No free port found"; exit 1; fi
python3 -m http.server "$PORT" --bind 127.0.0.1
