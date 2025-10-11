#!/usr/bin/env bash

source "$HOME/.config/timezones/.env.local"
# REGION

FE_KEY_NAME="timezones-frontend-peter"
FE_KEY_PATH="$HOME/.ssh/aws/${FE_KEY_NAME}.pem"

aws ec2 create-key-pair \
  --key-name "$FE_KEY_NAME" \
  --key-type ed25519 \
  --key-format pem \
  --region "$REGION" \
  --query 'KeyMaterial' --output text > "$FE_KEY_PATH"

chmod 400 "$FE_KEY_PATH"

echo "Add the following to your ~/.config/timezones/.env.local file:"
echo "FE_KEY_NAME=\"$FE_KEY_NAME\""
echo "FE_KEY_PATH=\"$FE_KEY_PATH\""
