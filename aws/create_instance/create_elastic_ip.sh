#!/usr/bin/env bash
set -euo pipefail

source "$HOME/.config/timezones/.env.local"
# REGION

# === FILL THESE IN ===
EIP_NAME="timezones-frontend-eip" # tag to identify this EIP
PROJECT_TAG="timezones"     # optional project tag

# Allocate an Elastic IP for use in a VPC
ALLOC_ID=$(aws ec2 allocate-address \
  --region "$REGION" \
  --domain vpc \
  --query 'AllocationId' \
  --output text)

# Fetch its public IP
PUBLIC_IP=$(aws ec2 describe-addresses \
  --region "$REGION" \
  --allocation-ids "$ALLOC_ID" \
  --query 'Addresses[0].PublicIp' \
  --output text)

# Tag it for easy tracking
aws ec2 create-tags \
  --region "$REGION" \
  --resources "$ALLOC_ID" \
  --tags Key=Name,Value="$EIP_NAME" Key=Project,Value="$PROJECT_TAG" >/dev/null

echo 'Add the following to your ~/.config/chistory/.env.local file:'
echo "ALLOC_ID=\"$ALLOC_ID\""
echo "PUBLIC_IP=\"$PUBLIC_IP\""



