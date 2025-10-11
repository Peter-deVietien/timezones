#!/usr/bin/env bash
set -euo pipefail

# === SETTINGS ===
GROUP_NAME="developer-communisthistory"

echo "Creating IAM group: $GROUP_NAME (if it doesn’t already exist)"
aws iam create-group --group-name "$GROUP_NAME" 2>/dev/null || \
    echo "✅ Group already exists."

echo "Attaching AmazonEC2FullAccess..."
aws iam attach-group-policy --group-name "$GROUP_NAME" \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess

echo "Attaching AmazonSSMFullAccess..."
aws iam attach-group-policy --group-name "$GROUP_NAME" \
--policy-arn arn:aws:iam::aws:policy/AmazonSSMFullAccess

echo "Attaching IAMReadOnlyAccess..."
aws iam attach-group-policy --group-name "$GROUP_NAME" \
--policy-arn arn:aws:iam::aws:policy/IAMReadOnlyAccess

echo
echo "✅ Done. Group '$GROUP_NAME' now has:"
echo "  - AmazonEC2FullAccess"
echo "  - AmazonSSMFullAccess"
echo "  - IAMReadOnlyAccess"
echo
echo "Next step: create a user and add them to this group:"
echo "  aws iam create-user --user-name peter"
echo "  aws iam add-user-to-group --user-name peter --group-name $GROUP_NAME"
