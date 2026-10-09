# Adinkra Ball 2026 — Deployment Reference & Credentials

- **GitHub Repository**: https://github.com/denneltechnologies-tech/Adinkraball
- **Active Branch**: `main`
- **Live Preview URL (HTTPS)**: https://adinkraball-69-62-106-189.sslip.io
- **Admin Portal**: https://adinkraball-69-62-106-189.sslip.io/admin (Default Password: `ghpn-admin-2026`)
- **Landing & Ticket RSVP**: https://adinkraball-69-62-106-189.sslip.io/landing
- **API Health Check**: https://adinkraball-69-62-106-189.sslip.io/api/health
- **VPS Host**: `69.62.106.189`
- **SSH User**: `root`
- **SSH Password**: `Kissinger2026@`
- **Dokploy Control Panel**: http://69.62.106.189:3000 / https://admin.growthshperegh.cloud
- **Project Name in Dokploy**: `Adinkra ball` (ID: `YTKZK87CDV9hLuMkx7uFe`)
- **Environment**: `production` (ID: `EfFdS-siUhRcydsl8WCgD`)
- **Dokploy App Name**: `adinkraball-app-ghpn2026` (App ID: `adk_app_ghpn2026`)
- **Auto-Deploy Webhook URL**: `http://69.62.106.189:3000/api/deploy/adk_webhook_ghpn_2026_auto`
- **GitHub Webhook ID**: `694625118` (Status: Active, Event: `push`)
- **Persistent Data Volume**: `adinkraball-data` mounted at `/app/data` (protects `submissions.json` across deploys)

## How Automatic Deployment Works
Every time changes are committed and pushed to `main` (`git push origin main`), GitHub immediately sends a push webhook to Dokploy. Dokploy:
1. Clones the latest commit from `https://github.com/denneltechnologies-tech/Adinkraball.git`.
2. Builds the container image using the project `Dockerfile`.
3. Attaches persistent storage volume `adinkraball-data` to preserve registered attendees and ticket orders.
4. Seamlessly updates the Docker Swarm service `adinkraball-app-ghpn2026`.
5. Traefik automatically routes incoming HTTPS traffic with Let's Encrypt SSL.
