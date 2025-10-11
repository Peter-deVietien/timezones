#!/usr/bin/env bash
set -euo pipefail

# Colors for clarity
green=$(tput setaf 2 || true)
red=$(tput setaf 1 || true)
blue=$(tput setaf 4 || true)
reset=$(tput sgr0 || true)

# Define commands (each as a full bash line)
commands=(
  "sudo apt update"
  "sudo apt install -y nginx rsync"
  "sudo mkdir -p /var/www/angular-app"
  "sudo chown -R \$USER:\$USER /var/www/angular-app"
  "sudo tee /etc/nginx/sites-available/angular <<'CONF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name communisthistory.com www.communisthistory.com;
    root /var/www/angular-app/browser;
    index index.csr.html index.html;

    location / {
        try_files \$uri \$uri/ /index.csr.html;
    }
}
CONF"
  "sudo ln -sf /etc/nginx/sites-available/angular /etc/nginx/sites-enabled/angular"
  "sudo rm /etc/nginx/sites-enabled/default"
  "sudo nginx -t"
  "sudo systemctl reload nginx"
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
