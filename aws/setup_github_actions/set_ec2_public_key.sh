#!/usr/bin/env bash
set -euo pipefail

source "$HOME/.config/chistory/.env"
# REGION
source "$HOME/.config/chistory/.env.local"
# CI_KEY_NAME, INSTANCE_ID

echo "[debug] PUBLIC_IP (EC2_HOST): $PUBLIC_IP"

# 2) Get the public key material from AWS
PUB_KEY=$(aws ec2 describe-key-pairs \
  --region "$REGION" \
  --key-names "$CI_KEY_NAME" \
  --include-public-key \
  --query 'KeyPairs[0].PublicKey' \
  --output text)

echo "[debug] CI_KEY_NAME: $CI_KEY_NAME"
echo "[debug] PUB_KEY (first 60 chars): ${PUB_KEY:0:60}..."

ssh -i "$FE_KEY_PATH" -o StrictHostKeyChecking=no ubuntu@"$PUBLIC_IP" \
 "echo '$PUB_KEY' >> ~/.ssh/authorized_keys"
