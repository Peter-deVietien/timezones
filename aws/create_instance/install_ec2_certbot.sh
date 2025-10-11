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
  "sudo certbot --nginx -d communisthistory.com \
  -d www.communisthistory.com \
  --non-interactive \
  --agree-tos \
  -m communisthistory0@gmail.com \
  --redirect"
  "sudo systemctl enable certbot.timer"
  "sudo systemctl start certbot.timer"

  # === SUDO PASSWORD SETUP (run last) ===
  "read -s -p 'Enter new sudo password for user '\$USER': ' NEW_PASS"
  "echo \"\$USER:\$NEW_PASS\" | sudo chpasswd"
  "sudo sed -i 's/NOPASSWD:[[:space:]]*ALL/ALL/g' /etc/sudoers.d/90-cloud-init-users"
  "sudo sed -i \"/\$USER\\s\\+ALL=(ALL)\\s\\+NOPASSWD: ALL/d\" /etc/sudoers || true"
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
