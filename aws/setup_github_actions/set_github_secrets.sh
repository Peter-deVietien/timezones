#!/usr/bin/env bash
set -euo pipefail

source "$HOME/.config/timezones/.env.local"
# CI_KEY_NAME, INSTANCE_ID

REPO="Peter-deVietien/timezones"

EC2_USER="ubuntu"                                              # e.g. ec2-user (Amazon Linux) or ubuntu (Ubuntu)
SSH_PORT="22"
TARGET_DIR="/var/www/angular-app"                                 # where build artifacts will land on the server

echo "Setting secrets in $REPO ..."

gh secret set CI_PRIVATE_KEY --repo "$REPO" < "$CI_KEY_PATH"
gh secret set EC2_HOST   --repo "$REPO" --body "$PUBLIC_IP"
gh secret set EC2_USER        --repo "$REPO" --body "$EC2_USER"
gh secret set SSH_PORT        --repo "$REPO" --body "$SSH_PORT"
gh secret set TARGET_DIR      --repo "$REPO" --body "$TARGET_DIR"

echo "Done. Verify with: gh secret list --repo $REPO"
