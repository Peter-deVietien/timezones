#!/usr/bin/env bash
set -euo pipefail

# === Defaults (you can change these) ===
REGION="us-east-1"
PARAM_KEY_NAME="/dns/godaddy/key"
PARAM_SECRET_NAME="/dns/godaddy/secret"

# --- Secure prompts (hidden input) ---
read -s -p "Enter GoDaddy API KEY: " GODADDY_KEY; echo
read -s -p "Enter GoDaddy API SECRET: " GODADDY_SECRET; echo

echo
echo "Storing parameters in SSM (region: $REGION)..."

# Put parameters (encrypted SecureString). --overwrite allows safe re-runs.
aws ssm put-parameter \
  --name "$PARAM_KEY_NAME" \
  --type SecureString \
  --value "$GODADDY_KEY" \
  --overwrite \
  --region "$REGION" 

aws ssm put-parameter \
  --name "$PARAM_SECRET_NAME" \
  --type SecureString \
  --value "$GODADDY_SECRET" \
  --overwrite \
  --region "$REGION"

echo "✅ Saved:"
echo "  KEY   -> $PARAM_KEY_NAME"
echo "  SECRET-> $PARAM_SECRET_NAME"
echo
echo "To retrieve them later in a script:"
cat <<'SNIPPET'
GODADDY_KEY=$(aws ssm get-parameter --name "/dns/godaddy/key" --with-decryption --query 'Parameter.Value' --output text)
GODADDY_SECRET=$(aws ssm get-parameter --name "/dns/godaddy/secret" --with-decryption --query 'Parameter.Value' --output text)
: "${GODADDY_KEY:?missing}"; : "${GODADDY_SECRET:?missing}"
SNIPPET

