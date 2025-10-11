#!/usr/bin/env bash
set -euo pipefail

source "$HOME/.config/timezones/.env.local"

# === FILL THESE IN ===
INSTANCE_NAME="timezones-frontend"
INSTANCE_TYPE="t3.micro"       

# 1) Fetch latest Ubuntu 24.04 LTS AMI
AMI_ID=$(aws ssm get-parameters \
  --region "$REGION" \
  --names "/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id" \
  --query 'Parameters[0].Value' --output text)

# 2) Launch instance
INSTANCE_ID=$(aws ec2 run-instances \
  --region "$REGION" \
  --image-id "$AMI_ID" \
  --instance-type "$INSTANCE_TYPE" \
  --key-name "$FE_KEY_NAME" \
  --security-group-ids "$SG_ID" \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${INSTANCE_NAME}}]" \
  --query 'Instances[0].InstanceId' --output text)

# 3) Wait for instance to start and associate Elastic IP
aws ec2 wait instance-running --region "$REGION" --instance-ids "$INSTANCE_ID"

aws ec2 associate-address \
  --region "$REGION" \
  --allocation-id "$ALLOC_ID" \
  --instance-id "$INSTANCE_ID" >/dev/null

PUBLIC_IP=$(aws ec2 describe-addresses \
  --region "$REGION" \
  --allocation-ids "$ALLOC_ID" \
  --query 'Addresses[0].PublicIp' --output text)

echo "Instance launched successfully."
echo "  Instance ID:   $INSTANCE_ID"
echo "  Elastic IP:    $PUBLIC_IP"
echo "  Region:        $REGION"
echo
echo "Visit: http://$PUBLIC_IP"

echo "Add the following to your ~/.config/timezones/.env.local file:"
echo "INSTANCE_ID=\"$INSTANCE_ID\""
echo "EC2_USER=\"ubuntu\""

