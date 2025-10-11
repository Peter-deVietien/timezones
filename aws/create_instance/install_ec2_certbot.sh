#!/usr/bin/env bash
set -euo pipefail

# Colors for clarity
green=$(tput setaf 2 || true)
red=$(tput setaf 1 || true)
blue=$(tput setaf 4 || true)
reset=$(tput sgr0 || true)

# Define commands (each as a full bash line)
commands=(
  # === INSTALL CERTBOT AND ENABLE HTTPS ===
  "sudo apt install -y certbot python3-certbot-nginx"
  "sudo certbot --nginx -d timezones.ai \
  -d www.timezones.ai \
  --non-interactive \
  --agree-tos \
  -m pdevietien3@gmail.com \
  --redirect"
  "sudo systemctl enable certbot.timer"
  "sudo systemctl start certbot.timer"
)

# Run commands interactively
for ((i=0; i<${#commands[@]}; i++)); do
  echo
  echo "${blue}[$((i+1))/${#commands[@]}] Next command:${reset}"
  echo "   ${commands[$i]}"
  read -rp "Press Enter to run it (or Ctrl+C to cancel)... "

  echo "---- Running ----"
  if eval "${commands[$i]}"; then
    echo "${green}✅ Command succeeded${reset}"
  else
    echo "${red}❌ Command failed (exit code $?)${reset}"
  fi
  echo "-----------------"
done

echo
echo "${green}🎉 All commands processed successfully!${reset}"
