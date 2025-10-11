#!/usr/bin/env bash
set -euo pipefail

source "$HOME/.config/timezones/.env.local"
# REGION

# ==== FILL THESE IN ====
SG_NAME="timezones-frontend-sg"      # must be unique in the VPC
DESCRIPTION="Allow SSH, HTTP, and HTTPS for Angular frontend"

# ==== You likely don't need to change below ====
# Get the default VPC in the region
VPC_ID=$(aws ec2 describe-vpcs \
  --region "$REGION" \
  --filters Name=isDefault,Values=true \
  --query 'Vpcs[0].VpcId' \
  --output text)

# Create the security group
SG_ID=$(aws ec2 create-security-group \
  --region "$REGION" \
  --group-name "$SG_NAME" \
  --description "$DESCRIPTION" \
  --vpc-id "$VPC_ID" \
  --query 'GroupId' \
  --output text)

# Inbound rules: SSH(22), HTTP(80), HTTPS(443) for IPv4 + IPv6
aws ec2 authorize-security-group-ingress --region "$REGION" --group-id "$SG_ID" \
  --ip-permissions '[
    {"IpProtocol":"tcp","FromPort":22,"ToPort":22,
     "IpRanges":[{"CidrIp":"0.0.0.0/0"}]},
    {"IpProtocol":"tcp","FromPort":80,"ToPort":80,
     "IpRanges":[{"CidrIp":"0.0.0.0/0"}],
     "Ipv6Ranges":[{"CidrIpv6":"::/0"}]},
    {"IpProtocol":"tcp","FromPort":443,"ToPort":443,
     "IpRanges":[{"CidrIp":"0.0.0.0/0"}],
     "Ipv6Ranges":[{"CidrIpv6":"::/0"}]}
  ]'

echo "Created Security Group:"
echo "  Name:        $SG_NAME"
echo "  ID:          $SG_ID"
echo "  Region:      $REGION"
echo "  VPC ID:      $VPC_ID"

echo "Add the following to your ~/.config/chistory/.env.local file:"
echo "SG_ID=\"$SG_ID\""

