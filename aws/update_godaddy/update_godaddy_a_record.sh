#!/usr/bin/env bash
set -euo pipefail

source "$HOME/.config/chistory/.env"
# REGION
source "$HOME/.config/chistory/.env.local"
# PUBLIC_IP

DOMAIN="communisthistory.com"                # your domain at GoDaddy # from developer.godaddy.com (Production)
TTL=600                             # seconds; 600 is fine

GODADDY_KEY=$(aws ssm get-parameter --name "/dns/godaddy/key" --with-decryption --query 'Parameter.Value' --output text)
GODADDY_SECRET=$(aws ssm get-parameter --name "/dns/godaddy/secret" --with-decryption --query 'Parameter.Value' --output text)


echo "Updating A records for $DOMAIN -> $PUBLIC_IP (TTL=$TTL)"

# 2) Point the root/apex (@) to the IP
curl -sS -X PUT "https://api.godaddy.com/v1/domains/$DOMAIN/records/A/%40" \
  -H "Authorization: sso-key $GODADDY_KEY:$GODADDY_SECRET" \
  -H "Content-Type: application/json" \
  -d "[{\"data\":\"$PUBLIC_IP\",\"ttl\":$TTL}]" \
  | sed -e 's/^/[@] /'

# 3) Make www a CNAME to @ (recommended), or make it an A record too if you prefer
curl -sS -X PUT "https://api.godaddy.com/v1/domains/$DOMAIN/records/CNAME/www" \
  -H "Authorization: sso-key $GODADDY_KEY:$GODADDY_SECRET" \
  -H "Content-Type: application/json" \
  -d "[{\"data\":\"@\",\"ttl\":$TTL}]" \
  | sed -e 's/^/[www] /'

# 4) (Optional) Verify what’s set on GoDaddy immediately
echo "Verifying DNS in GoDaddy:"
curl -sS -H "Authorization: sso-key $GODADDY_KEY:$GODADDY_SECRET" \
  "https://api.godaddy.com/v1/domains/$DOMAIN/records/A/%40" ; echo
curl -sS -H "Authorization: sso-key $GODADDY_KEY:$GODADDY_SECRET" \
  "https://api.godaddy.com/v1/domains/$DOMAIN/records/CNAME/www" ; echo

echo "Done. Public resolvers may take a few minutes to show the change."
