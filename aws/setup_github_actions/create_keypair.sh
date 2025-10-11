#!/usr/bin/env bash
set -euo pipefail

source "$HOME/.config/timezones/.env.local"
# REGION

# === FILL THESE IN ===
CI_KEY_NAME="timezones-frontend-github-actions"
CI_KEY_PATH="$HOME/.ssh/ci/${CI_KEY_NAME}.pem"

mkdir -p "$HOME/.ssh/ci"

# 1) Create a key pair on AWS (private key saved locally)
aws ec2 create-key-pair \
  --region "$REGION" \
  --key-name "$CI_KEY_NAME" \
  --query 'KeyMaterial' \
  --output text > "$CI_KEY_PATH"

# 2) Restrict permissions (required for SSH)
chmod 400 "$CI_KEY_PATH"

# 4) Output results
echo "Add the following to your ~/.config/timezones/.env.local file:"
echo "CI_KEY_NAME=\"$CI_KEY_NAME\""
echo "CI_KEY_PATH=\"$CI_KEY_PATH\""
