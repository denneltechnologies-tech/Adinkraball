# Deployment & VPS Reference Rules - GhPN Adinkra Ball 2026

## Project Overview
- **Project Name:** Adinkra ball
- **Application Context:** Ghana Professionals Network (GhPN) Adinkra Ball 2026 Gala & Awards Portal
- **Workspace Location:** `c:\Users\Charis Computer Hub\Downloads\Professionals`
- **GitHub Repository:** `https://github.com/denneltechnologies-tech/Adinkraball`
- **GitHub Branch:** `main`

## VPS & Server Infrastructure
- **VPS Host:** `69.62.106.189`
- **SSH Username:** `root`
- **SSH Password:** `Kissinger2026@`
- **Deployment Platform:** Dokploy (Docker Swarm orchestrated)
- **Dokploy Panel URL:** `http://69.62.106.189:3000` / `https://admin.growthshperegh.cloud`
- **Dokploy Project:** `Adinkra ball` (ID: `YTKZK87CDV9hLuMkx7uFe`)
- **Dokploy Environment:** `production` (ID: `EfFdS-siUhRcydsl8WCgD`)
- **Dokploy Application:** `adinkra-ball` (ID: `adk_app_ghpn2026`, Service: `adinkraball-app-ghpn2026`)

## Live Domains & Endpoints
- **Public URL (HTTPS):** `https://adinkraball-69-62-106-189.sslip.io`
- **Public URL (HTTP):** `http://adinkraball-69-62-106-189.sslip.io`
- **Admin Portal:** `https://adinkraball-69-62-106-189.sslip.io/admin`
- **Lead / Ticket Registration:** `https://adinkraball-69-62-106-189.sslip.io/landing`
- **Health Check:** `https://adinkraball-69-62-106-189.sslip.io/api/health`

## Automated CI/CD & Webhook Configuration
- **Auto-Deploy Webhook URL:** `http://69.62.106.189:3000/api/deploy/adk_webhook_ghpn_2026_auto`
- **GitHub Webhook ID:** `694625118` (Active: True, Event: `push`)
- **Mechanism:** Any commit pushed to `origin main` automatically sends a `push` event with header `x-github-event: push`. Dokploy pulls the latest commit, builds the container with `Dockerfile`, mounts the persistent volume `adinkraball-data` to `/app/data`, and redeploys with zero downtime.

## Data Persistence
- **Docker Volume:** `adinkraball-data` mounted at `/app/data`.
- **Protected Files:** `data/submissions.json` persists across all container rebuilds and updates.
