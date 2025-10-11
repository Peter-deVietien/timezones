#!/usr/bin/env bash
set -euo pipefail

source "$HOME/.config/timezones/.env.local"

# --- fill these in ---
LOCAL_FILE1="install_ec2_software.sh"             # trailing slash = sync contents
LOCAL_FILE2="install_ec2_certbot.sh"             # trailing slash = sync contents
LOCAL_FILE3="install_ec2_sudopwd.sh"             # trailing slash = sync contents

# --- rsync to EC2 (shows progress; preserves perms/times) ---
rsync -azP \
  -e "ssh -i $FE_KEY_PATH -o StrictHostKeyChecking=accept-new" \
  "$LOCAL_FILE1" "$LOCAL_FILE2" "$LOCAL_FILE3" \
  "$EC2_USER@$PUBLIC_IP:"

# --- then SSH in ---
ssh -i "$FE_KEY_PATH" -o StrictHostKeyChecking=accept-new "$EC2_USER@$PUBLIC_IP"
