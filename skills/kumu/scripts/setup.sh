#!/usr/bin/env bash
# Kumu setup for macOS and Linux. Safe to run more than once.
# Installs the Python voice environment, HyperFrames skills, and the headless
# browser, then runs the HyperFrames health check.
set -euo pipefail

KUMU_HOME="${KUMU_HOME:-$HOME/.kumu}"
VENV="$KUMU_HOME/venv"
PY="$VENV/bin/python"

missing=()
node_major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
[ "$node_major" -ge 22 ] || missing+=("Node.js 22+")
command -v ffmpeg >/dev/null || missing+=("FFmpeg")
command -v python3 >/dev/null || missing+=("Python 3")

if [ ${#missing[@]} -gt 0 ]; then
  echo "Missing: ${missing[*]}"
  case "$(uname -s)" in
    Darwin) echo "Install with Homebrew: brew install node ffmpeg python" ;;
    Linux)
      if command -v apt-get >/dev/null; then
        echo "Install with: sudo apt-get install -y ffmpeg python3 python3-venv  (Node 22: https://nodejs.org/en/download)"
      elif command -v pacman >/dev/null; then
        echo "Install with: sudo pacman -S --needed nodejs npm ffmpeg python"
      elif command -v dnf >/dev/null; then
        echo "Install with: sudo dnf install -y nodejs ffmpeg python3"
      fi ;;
  esac
  echo "Then run this script again."
  exit 1
fi

echo "==> Python environment at $VENV"
[ -x "$PY" ] || python3 -m venv "$VENV"
"$PY" -m pip install -q --upgrade pip
"$PY" -m pip install -q kokoro-onnx soundfile yt-dlp

echo "==> HyperFrames skills and browser"
SKILLS_CLONE_TIMEOUT_MS=600000 npx -y hyperframes skills update \
  || echo "WARNING: skills update failed (slow network?). Installed skills are kept; run this script again later."
npx -y hyperframes browser ensure

echo "==> Health check (ignore BGM / MusicGen: Kumu uses bundled music)"
report="$(HYPERFRAMES_PYTHON="$PY" npx -y hyperframes doctor 2>&1 || true)"
echo "$report"
if echo "$report" | grep "✗" | grep -qv "BGM"; then
  echo "Some checks failed; fix them and run this script again."
  exit 1
fi
touch "$KUMU_HOME/ready"

echo
echo "Kumu is ready. Python for HyperFrames: HYPERFRAMES_PYTHON=$PY"
