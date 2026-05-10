# 🚀 Django Production Deployment (Step-by-Step)
### Docker + PostgreSQL + GitHub Actions (CI/CD) + DigitalOcean Droplet + Nginx + Gunicorn + Custom Domain + SSL

This guide explains how to deploy a **Django + React/Vite application** from local development to **production** using:

- Django / DRF
- React / Vite
- Docker & Docker Compose
- PostgreSQL
- GitHub Actions (CI/CD)
- DigitalOcean Droplet VPS
- Nginx Reverse Proxy
- Gunicorn
- Custom Domain
- SSL with Let’s Encrypt

You will go step-by-step from:

**Local → Docker → GitHub → DigitalOcean Droplet → Domain → HTTPS**

---

## 🧰 Prerequisites

Install the following on your local system:

- Git
- Python 3.10+
- pip
- Node.js + npm
- Docker Desktop
- VS Code
- GitHub account
- DigitalOcean account
- Domain name, optional but required for SSL

---

## 📦 Step 1 — Clone the Project

```sh
# Clone the existing project from GitHub to your local machine
git clone https://github.com/dev-rathankumar/django_clickmart_

# Go inside the project folder
cd django_clickmart_
```

---

## 🧹 Step 2 — Remove Old Git History

```sh
# Remove the old Git history and old remote URL
rm -rf .git
```

This removes previous commit history and remote repository connection. Now the project is only local files on your computer.

---

## 🆕 Step 3 — Create Your Own GitHub Repository

1. Go to GitHub.
2. Click **New Repository**.
3. Repository name example: `django-clickmart`.
4. Keep it public or private as you want.
5. Do not add README, `.gitignore`, or license from GitHub if your project already has files.

---

## 🔁 Step 4 — Re-initialize Git

```sh
# Initialize a new Git repository
git init

# Add all project files
git add .

# Create first commit
git commit -m "Initial project setup"

# Rename current branch to main
git branch -M main

# Connect your local project with your own GitHub repository
git remote add origin https://github.com/<YOUR-USERNAME>/<REPOSITORY-NAME>.git

# Push code to GitHub
git push -u origin main
```

Now your source code is available in your own GitHub repository.

---

# 🧪 Local Setup Without Docker

## Step 5 — Run Django Locally

Go inside backend folder:

```sh
# Go inside Django backend folder
cd backend-drf
```

Create virtual environment:

```sh
# Create Python virtual environment
python3 -m venv env

# Activate virtual environment on Mac/Linux
source env/bin/activate

# Activate virtual environment on Windows PowerShell
env\Scripts\activate
```

Install dependencies:

```sh
# Install backend Python dependencies
pip install -r requirements.txt
```

Create `.env` file inside `/backend-drf/`:

```sh
DEBUG=True
SECRET_KEY=<YOUR-SECRET-KEY>

# Database Settings
DB_NAME=<DATABASE-NAME>
DB_USER=<POSTGRES-USERNAME>
DB_PASSWORD=<YOUR-PASSWORD>
DB_HOST=localhost
DB_PORT=5432

# Email Configuration
EMAIL_HOST_USER=<YOUR-EMAIL-ADDRESS>
EMAIL_HOST_PASSWORD=<PASSWORD> # Use app password if you are using Gmail
```

Run migrations and server:

```sh
# Create database tables
python manage.py migrate

# Start Django local development server
python manage.py runserver
```

Backend will run on:

```txt
http://127.0.0.1:8000/
```

---

## Step 6 — Run React/Vite Frontend Locally

Go inside frontend folder:

```sh
# Go back to project root if you are inside backend-drf
cd ..

# Go inside frontend folder
cd frontend
```

Create `.env` file inside `/frontend/`:

```sh
VITE_SERVER_BASE_URL=http://127.0.0.1:8000/api/v1
```

Install and run frontend:

```sh
# Install frontend dependencies
npm install

# Start React/Vite development server
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173/
```

Optional: Create Django superuser and add products.

```sh
# Go inside backend folder
cd ../backend-drf

# Create Django admin user
python manage.py createsuperuser
```

---

# 🐳 Docker Setup Locally

## Step 7 — Verify Docker and Docker Compose

```sh
# Check Docker version
docker --version

# Check Docker Compose version
docker compose version
```

---

## Step 8 — Create Backend Dockerfile

Create a new file named `Dockerfile` inside `/backend-drf/`:

```Dockerfile
# Purpose: A Dockerfile is a step-by-step instruction file that tells Docker how to build and run our Django application.
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# gunicorn = production server
# config.wsgi:application = Django entry point
# --bind 0.0.0.0:8000 = external traffic
# --workers 3 = 3 Django app workers
# --timeout 180 = long request timeout
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "180"]
```

> Replace `config.wsgi:application` with your actual Django project WSGI path if your project folder name is different.

---

## Step 9 — Create Backend `.env.docker`

Create `.env.docker` inside `/backend-drf/`:

```sh
SECRET_KEY=<YOUR-DJANGO-SECRET-KEY>
DEBUG=True

# Database Settings for Docker
DB_NAME=<YOUR_DOCKER_DB>
DB_USER=postgres
DB_PASSWORD=<PASSWORD>
DB_HOST=db
DB_PORT=5432

# Allowed hosts for local Docker
ALLOWED_HOSTS=localhost,127.0.0.1

# Email Configuration
EMAIL_HOST_USER=<YOUR-EMAIL-ADDRESS>
EMAIL_HOST_PASSWORD=<YOUR-PASSWORD> # App password if you are using Gmail
```

---

## Step 10 — Create PostgreSQL `.env.production`

Create `.env.production` inside `/backend-drf/`:

```sh
POSTGRES_DB=<YOUR_DOCKER_DB>
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<PASSWORD>
```

---

## Step 11 — Create Frontend Dockerfile

Create a new file named `Dockerfile` inside `/frontend/`:

```Dockerfile
# Stage 1: Build React/Vite app
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files first for better Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Build argument for backend API URL
ARG VITE_SERVER_BASE_URL

# Pass backend API URL to React/Vite build
ENV VITE_SERVER_BASE_URL=$VITE_SERVER_BASE_URL

# Build frontend
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy React build output to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## Step 12 — Create Frontend Nginx Config

Create `nginx.conf` inside `/frontend/`:

```
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Optional: Handle error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}


```

---

## Step 13 — Create Root `docker-compose.yml`

Create `docker-compose.yml` in the root folder:

```yml
services:
  db:
    image: postgres:16-alpine
    env_file:
      - ./backend-drf/.env.production
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    build: ./backend-drf
    ports:
      - "8000:8000"
    env_file:
      - ./backend-drf/.env.docker
    depends_on:
      - db
    volumes:
      - ./backend-drf:/app
      - ./backend-drf/static:/app/static
      - ./backend-drf/media:/app/media
    command: >
      sh -c "python manage.py collectstatic --noinput &&
             python manage.py migrate &&
             python manage.py runserver 0.0.0.0:8000"
    restart: always

  frontend:
    build:
      context: ./frontend
      args:
        VITE_SERVER_BASE_URL: "http://localhost:8000/api/v1"
    ports:
      - "5173:80"
    depends_on:
      - backend
    restart: always

volumes:
  postgres_data:
```

Run Docker locally:

```sh
# Build and start all Docker containers
docker compose up --build
```

Check containers:

```sh
# Show running containers and their status
docker compose ps
```

Create superuser inside Docker:

```sh
# Run createsuperuser command inside backend container
docker compose exec backend python manage.py createsuperuser
```

Test locally:

```txt
Backend:  http://localhost:8000/
Frontend: http://localhost:5173/
```

---

# 🌊 DigitalOcean Deployment

## Step 14 — Create DigitalOcean Droplet

1. Login to DigitalOcean.
2. Go to **Droplets**.
3. Click **Create Droplet**.
4. Select image: **Ubuntu 24.04 LTS** or **Ubuntu 22.04 LTS**.
5. Choose a plan according to your budget.
   - Basic testing: 1 GB RAM / 1 vCPU
   - Better for Django + React + PostgreSQL Docker setup: 2 GB RAM / 1 or 2 vCPU
6. Choose region close to your users.
7. Add SSH key.
8. Create Droplet.
9. Copy your Droplet public IP.

Example placeholder:

```txt
<DROPLET_IP>
```

---

## Step 15 — Create SSH Key Locally

Run these commands on your local machine:

```bash
# Check if SSH keys already exist on your local machine
ls ~/.ssh

# Create a new SSH key for DigitalOcean login
ssh-keygen -t ed25519 -C "clickmart-digitalocean"
```

When it asks file name, you can save it like:

```txt
~/.ssh/clickmart_do
```

Show public key:

```bash
# Copy this public key and add it to DigitalOcean Droplet SSH key section
cat ~/.ssh/clickmart_do.pub
```

---

## Step 16 — SSH into DigitalOcean Droplet

```sh
# Login to your DigitalOcean Droplet as root using Droplet public IP
ssh root@<DROPLET_IP>
```

If you used a custom SSH key file:

```sh
# Login with specific SSH private key file
ssh -i ~/.ssh/clickmart_do root@<DROPLET_IP>
```

---

## Step 17 — Update DigitalOcean Server

Run on DigitalOcean Droplet:

```sh
# Update Ubuntu package list and upgrade installed packages
apt update && apt upgrade -y
```

---

## Step 18 — Install Required Software on DigitalOcean

Install Docker:

```sh
# Install Docker using official convenience script on DigitalOcean Ubuntu server
curl -fsSL https://get.docker.com | sh

# Verify Docker installation
docker --version
```

Install Docker Compose plugin:

```sh
# Install Docker Compose plugin on DigitalOcean Ubuntu server
apt install docker-compose-plugin -y

# Verify Docker Compose installation
docker compose version
```

Install Git:

```sh
# Install Git on DigitalOcean server
apt install git -y

# Verify Git installation
git --version
```

Optional but recommended: install basic tools:

```sh
# Install useful server tools for editing, checking network, and debugging
apt install nano curl ufw ca-certificates gnupg lsb-release -y
```

---

## Step 19 — Configure Basic Firewall on DigitalOcean Server

> DigitalOcean also has **Cloud Firewall** in dashboard. You can use either DigitalOcean Cloud Firewall or Ubuntu UFW. For simple setup, UFW is okay.

Allow required ports for initial testing:

```sh
# Allow SSH so you do not get locked out from DigitalOcean server
ufw allow OpenSSH

# Allow backend testing port temporarily
ufw allow 8000/tcp

# Allow frontend testing port temporarily
ufw allow 5173/tcp

# Allow HTTP for Nginx later
ufw allow 80/tcp

# Allow HTTPS for SSL later
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check firewall status and allowed ports
ufw status
```

Initial required ports:

```txt
22    SSH
8000  Django backend temporary testing
5173  React frontend temporary testing
80    HTTP
443   HTTPS
```

After Nginx production setup, you should remove public access to `8000` and `5173`.

---

## Step 20 — Clone Project into `/opt` on DigitalOcean

Run on DigitalOcean Droplet:

```sh
# Go to /opt directory where production apps are commonly stored
cd /opt

# Create project directory
mkdir clickmart

# Go inside project directory
cd clickmart

# Clone your GitHub repository into current folder
git clone https://github.com/<YOUR-USERNAME>/<REPOSITORY-NAME>.git .
```

Project path on server:

```txt
/opt/clickmart
```

---

## Step 21 — Create Environment Files on DigitalOcean

Create PostgreSQL production env file:

```sh
# Create PostgreSQL env file on DigitalOcean server
nano backend-drf/.env.production
```

Add:

```sh
POSTGRES_DB=<YOUR_DOCKER_DB>
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<STRONG_DATABASE_PASSWORD>
```

Create Django Docker env file:

```sh
# Create Django backend env file on DigitalOcean server
nano backend-drf/.env.docker
```

Add:

```sh
SECRET_KEY=<YOUR_DJANGO_SECRET_KEY>
DEBUG=False

# Database Settings
DB_NAME=<YOUR_DOCKER_DB>
DB_USER=postgres
DB_PASSWORD=<STRONG_DATABASE_PASSWORD>
DB_HOST=db
DB_PORT=5432

# DigitalOcean Droplet IP and localhost
ALLOWED_HOSTS=<DROPLET_IP>,localhost,127.0.0.1

# CORS allowed origin for temporary frontend port testing
CORS_ALLOWED_ORIGINS=http://<DROPLET_IP>:5173

# Email Configuration
EMAIL_HOST_USER=<YOUR-EMAIL-ADDRESS>
EMAIL_HOST_PASSWORD=<YOUR-APP-PASSWORD>
```

---

## Step 22 — Update Django Settings for Production

In Django `settings.py`, use environment-based hosts:

```python
import os

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",") if os.getenv("CORS_ALLOWED_ORIGINS") else []

CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",") if os.getenv("CSRF_TRUSTED_ORIGINS") else []
```

For static and media:

```python
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

Commit and push from local machine:

```sh
# Add changed settings file
git add .

# Commit environment-based production settings
git commit -m "Add production environment settings"

# Push to GitHub
git push origin main
```

Pull on DigitalOcean:

```sh
# Go to project directory on DigitalOcean server
cd /opt/clickmart

# Pull latest code from GitHub
git pull origin main
```

---

## Step 23 — Update Frontend API URL for Server Testing

In `docker-compose.yml`, for temporary IP-based testing, update frontend build arg:

```yml
frontend:
  build:
    context: ./frontend
    args:
      VITE_SERVER_BASE_URL: "http://<DROPLET_IP>:8000/api/v1"
```

Commit and push:

```sh
# Add docker-compose change
git add .

# Commit DigitalOcean IP based frontend API setup
git commit -m "Configure frontend API URL for DigitalOcean testing"

# Push changes to GitHub
git push origin main
```

Pull on DigitalOcean:

```sh
# Pull updated docker-compose.yml on DigitalOcean server
cd /opt/clickmart && git pull origin main
```

---

## Step 24 — Build and Run Docker Containers on DigitalOcean

Run on DigitalOcean Droplet:

```sh
# Build Docker images and start containers in detached mode on DigitalOcean server
docker compose up --build -d

# Check running containers
docker compose ps

# Check backend logs if needed
docker compose logs backend

# Check frontend logs if needed
docker compose logs frontend
```

Test in browser:

```txt
Backend:  http://<DROPLET_IP>:8000/
Frontend: http://<DROPLET_IP>:5173/
```

Create superuser on production:

```sh
# Create Django admin superuser inside backend container on DigitalOcean server
docker compose exec backend python manage.py createsuperuser
```

---

# 🔁 GitHub Actions CI/CD for DigitalOcean

## Step 25 — Rule Before Automation

❗Never automate something you have not tested manually.

First confirm this manual flow works on DigitalOcean:

```sh
# Go to project folder on DigitalOcean server
cd /opt/clickmart

# Pull latest code manually
git pull origin main

# Rebuild and restart containers manually
docker compose up --build -d
```

---

## Step 26 — Create GitHub Actions Workflow

In local project, create this file:

```txt
.github/workflows/automate.yml
```

Add:

```yml
name: Auto Deploy to DigitalOcean

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to DigitalOcean via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.DO_HOST }}
          username: ${{ secrets.DO_USER }}
          key: ${{ secrets.DO_SSH_KEY }}
          script: |
            # Go to project folder on DigitalOcean Droplet
            cd /opt/clickmart

            # Pull latest code from GitHub main branch
            git pull origin main

            # Rebuild and restart Docker containers on DigitalOcean
            docker compose up --build -d

            # Show running containers after deployment
            docker compose ps
```

---

## Step 27 — Add GitHub Secrets

Go to:

```txt
GitHub Repository → Settings → Secrets and variables → Actions → New repository secret
```

Add these secrets:

```txt
DO_HOST      → <DROPLET_IP>
DO_USER      → root
DO_SSH_KEY   → Your private SSH key content
```

To copy private key from local machine:

```bash
# Show private SSH key content for GitHub Secret DO_SSH_KEY
cat ~/.ssh/clickmart_do
```

⚠️ Do not share this private key publicly.

---

## Step 28 — Push Automation File

```sh
# Add GitHub Actions workflow file
git add .github/workflows/automate.yml

# Commit CI/CD setup for DigitalOcean
git commit -m "Setup CI/CD for DigitalOcean"

# Push to GitHub main branch
git push origin main
```

Check GitHub **Actions** tab.

Make a small frontend change and confirm auto-deploy.

---

# 🌐 Nginx Reverse Proxy Setup

Goal:

```txt
http://<DROPLET_IP>/        → React frontend
http://<DROPLET_IP>/api/    → Django backend API
http://<DROPLET_IP>/admin/  → Django admin
```

---

## Step 29 — Create Root Nginx Config

From local project root, create:

```txt
nginx/default.conf
```

Add:

```nginx
server {
    listen 80;
    server_name _;

    # Frontend React app
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django API
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django static files
    location /static/ {
        alias /static/;
    }

    # Django uploaded media files
    location /media/ {
        alias /media/;
    }
}
```

---

## Step 30 — Update `docker-compose.yml` for Nginx

Production-style `docker-compose.yml`:

```yml
services:
  db:
    image: postgres:16-alpine
    env_file:
      - ./backend-drf/.env.production
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    build: ./backend-drf
    env_file:
      - ./backend-drf/.env.docker
    depends_on:
      - db
    volumes:
      - ./backend-drf/static:/app/static
      - ./backend-drf/media:/app/media
    command: >
      sh -c "python manage.py collectstatic --noinput &&
             python manage.py migrate &&
             gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 180"
    restart: always

  frontend:
    build:
      context: ./frontend
      args:
        VITE_SERVER_BASE_URL: "/api/v1"
    depends_on:
      - backend
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./backend-drf/static:/static
      - ./backend-drf/media:/media
    depends_on:
      - frontend
      - backend
    restart: always

volumes:
  postgres_data:
```

Important changes:

- Backend port `8000` is no longer exposed publicly.
- Frontend port `5173` is no longer exposed publicly.
- Only Nginx port `80` is exposed.
- Frontend API URL becomes relative: `/api/v1`.
- Static and media are served by Nginx.

Commit and push:

```sh
# Add Nginx config and docker-compose production update
git add .

# Commit Nginx reverse proxy setup
git commit -m "Setup Nginx reverse proxy for DigitalOcean"

# Push to GitHub; GitHub Actions will deploy automatically if CI/CD is active
git push origin main
```

Or manually deploy on DigitalOcean:

```sh
# Go to project folder on DigitalOcean server
cd /opt/clickmart

# Pull latest Nginx changes
git pull origin main

# Rebuild and start containers with Nginx
docker compose up --build -d

# Check containers
docker compose ps
```

---

## Step 31 — Update Firewall for Production

After Nginx setup, only keep public ports:

```txt
22   SSH
80   HTTP
443  HTTPS
```

Remove temporary ports:

```sh
# Remove public access to Django backend testing port
ufw delete allow 8000/tcp

# Remove public access to React frontend testing port
ufw delete allow 5173/tcp

# Confirm firewall rules
ufw status
```

Final test:

```txt
http://<DROPLET_IP>/
```

---

# 🚀 Gunicorn Production Setup

## Step 32 — Add Gunicorn Dependency

In `backend-drf/requirements.txt`, add:

```txt
gunicorn
```

Update backend command in `docker-compose.yml`:

```yml
command: >
  sh -c "python manage.py collectstatic --noinput &&
         python manage.py migrate &&
         gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 180"
```

> Replace `config.wsgi:application` with your real Django WSGI path.

Commit and push:

```sh
# Add gunicorn dependency and docker-compose update
git add .

# Commit Gunicorn production setup
git commit -m "Deploy backend with Gunicorn"

# Push to GitHub
git push origin main
```

Verify Gunicorn on DigitalOcean:

```sh
# SSH into DigitalOcean server
ssh root@<DROPLET_IP>

# Go to project folder
cd /opt/clickmart

# Check backend container logs to confirm Gunicorn is running
docker compose logs backend
```

---

# 🌍 Custom Domain Setup on DigitalOcean

## Step 33 — Purchase a Domain

Buy domain from any provider:

- GoDaddy
- Namecheap
- Hostinger
- BigRock
- Cloudflare Registrar

DigitalOcean is mainly a hosting/cloud provider. You usually buy domain from another registrar and point it to DigitalOcean.

---

## Step 34 — Connect Domain to DigitalOcean Droplet

You have two common options:

### Option A — Manage DNS at Domain Provider

Add these A records at your domain provider:

| Type | Host | Value |
| ---- | ---- | ----- |
| A | @ | `<DROPLET_IP>` |
| A | www | `<DROPLET_IP>` |

### Option B — Manage DNS inside DigitalOcean

1. Go to DigitalOcean dashboard.
2. Open **Networking → Domains**.
3. Add your domain.
4. Add A records:

| Type | Hostname | Will Direct To |
| ---- | -------- | -------------- |
| A | @ | `<DROPLET_IP>` |
| A | www | `<DROPLET_IP>` |

If using DigitalOcean DNS, update nameservers at your domain registrar to DigitalOcean nameservers:

```txt
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com
```

DNS propagation can take a few minutes to 24 hours.

---

## Step 35 — Make Nginx Config Server-Managed

Certbot modifies Nginx config on the server. So it is better to stop tracking `nginx/default.conf` in Git.

Run locally:

```sh
# Remove nginx/default.conf from Git tracking but keep the file locally
git rm --cached nginx/default.conf
```

Add to `.gitignore`:

```gitignore
nginx/default.conf
```

Commit and push:

```sh
# Add .gitignore update
git add .gitignore

# Commit server-managed Nginx config setup
git commit -m "Make nginx config server managed"

# Push to GitHub
git push origin main
```

On DigitalOcean server, create/edit config manually:

```sh
# Go to project folder on DigitalOcean server
cd /opt/clickmart

# Create nginx folder if it does not exist
mkdir -p nginx

# Edit Nginx config directly on DigitalOcean server
nano nginx/default.conf
```

Add domain-based HTTP config:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /static/;
    }

    location /media/ {
        alias /media/;
    }
}
```

Restart Nginx:

```sh
# Restart only nginx container on DigitalOcean server
docker compose restart nginx
```

---

## Step 36 — Update Django Domain Settings

Edit `.env.docker` on DigitalOcean:

```sh
# Edit backend env file on DigitalOcean server
nano backend-drf/.env.docker
```

Update:

```sh
ALLOWED_HOSTS=example.com,www.example.com,<DROPLET_IP>,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://example.com,http://www.example.com
CSRF_TRUSTED_ORIGINS=http://example.com,http://www.example.com
```

Restart backend:

```sh
# Restart backend container so new env values apply
docker compose restart backend
```

Test domain HTTP:

```txt
http://example.com
```

---

# 🔐 SSL Setup with Let’s Encrypt

## Step 37 — Create Certbot Folders on DigitalOcean

Run on DigitalOcean server inside `/opt/clickmart`:

```sh
# Go to project folder on DigitalOcean server
cd /opt/clickmart

# Create folder for Let's Encrypt HTTP challenge files
mkdir -p certbot/www

# Create folder where SSL certificates will be stored
mkdir -p certbot/conf
```

---

## Step 38 — Update Nginx Service Volumes

In local `docker-compose.yml`, update nginx service volumes:

```yml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    - ./backend-drf/static:/static
    - ./backend-drf/media:/media
    - ./certbot/www:/var/www/certbot
    - ./certbot/conf:/etc/letsencrypt
  depends_on:
    - frontend
    - backend
  restart: always
```

Commit and push:

```sh
# Add docker-compose SSL volume and port changes
git add docker-compose.yml

# Commit SSL-ready Nginx docker-compose update
git commit -m "Prepare Nginx for SSL on DigitalOcean"

# Push to GitHub
git push origin main
```

Pull and restart on DigitalOcean:

```sh
# Pull latest docker-compose changes on DigitalOcean server
cd /opt/clickmart && git pull origin main

# Rebuild/restart containers with SSL volumes
docker compose up --build -d
```

---

## Step 39 — Add ACME Challenge Location in Nginx

Edit `nginx/default.conf` on DigitalOcean server:

```sh
# Edit server-managed Nginx config on DigitalOcean
nano nginx/default.conf
```

Inside port `80` server block, add:

```nginx
location /.well-known/acme-challenge/ {
    root /var/www/certbot;
}
```

Restart Nginx:

```sh
# Restart Nginx to apply ACME challenge path
docker compose restart nginx
```

Make sure HTTP site still works:

```txt
http://example.com
```

---

## Step 40 — Install Certbot on DigitalOcean Server

```sh
# Update package list before installing Certbot
apt update

# Install Certbot on DigitalOcean Ubuntu server
apt install certbot -y

# Verify Certbot installation
certbot --version
```

---

## Step 41 — Get SSL Certificate Using Webroot Method

Run on DigitalOcean server:

```sh
# Generate SSL certificate using webroot method for your domain and www subdomain
certbot certonly \
  --webroot \
  -w /opt/clickmart/certbot/www \
  -d example.com \
  -d www.example.com
```

Replace `example.com` with your real domain.

---

## Step 42 — Final HTTPS Nginx Config

Edit Nginx config on DigitalOcean:

```sh
# Edit Nginx final HTTPS config on DigitalOcean server
nano /opt/clickmart/nginx/default.conf
```

Use this final config:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    client_max_body_size 25M;

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /static/;
    }

    location /media/ {
        alias /media/;
    }
}
```

Restart Nginx:

```sh
# Restart Nginx after final HTTPS config update
docker compose restart nginx
```

Update Django secure origins:

```sh
# Edit Django env file on DigitalOcean server
nano backend-drf/.env.docker
```

Update:

```sh
ALLOWED_HOSTS=example.com,www.example.com,<DROPLET_IP>,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://example.com,https://www.example.com
CSRF_TRUSTED_ORIGINS=https://example.com,https://www.example.com
```

Restart backend:

```sh
# Restart backend so HTTPS domain env settings apply
docker compose restart backend
```

Final test:

```txt
https://example.com
```

---

## Step 43 — SSL Auto Renewal

Certbot usually installs a system timer automatically. Check it:

```sh
# Check Certbot auto-renewal timer on DigitalOcean server
systemctl list-timers | grep certbot
```

Test renewal:

```sh
# Dry-run SSL renewal test; this does not replace your real certificate
certbot renew --dry-run
```

If certificate renews, restart Nginx after renewal when needed:

```sh
# Restart Nginx container after SSL renewal if required
docker compose restart nginx
```

Optional cron job:

```sh
# Open root crontab on DigitalOcean server
crontab -e
```

Add:

```cron
# Renew SSL certificate daily and restart Nginx container after renewal
0 3 * * * certbot renew --quiet && cd /opt/clickmart && docker compose restart nginx
```

---

# 🖼️ Fix Media Files in Production

This fixes uploaded images not loading in production.

## Step 44 — Nginx Media Config

Open server-managed Nginx config on DigitalOcean:

```sh
# Edit Nginx config on DigitalOcean server
nano /opt/clickmart/nginx/default.conf
```

Inside HTTPS server block, ensure this exists:

```nginx
location /media/ {
    alias /media/;
}
```

Restart Nginx:

```sh
# Restart Nginx container so media config applies
docker compose restart nginx
```

---

## Step 45 — Mount Media Folder in Docker Compose

In `docker-compose.yml`, nginx service should have:

```yml
nginx:
  volumes:
    - ./backend-drf/media:/media
```

Backend should also have:

```yml
backend:
  volumes:
    - ./backend-drf/media:/app/media
```

Commit and push:

```sh
# Add media volume mapping changes
git add docker-compose.yml

# Commit media serving setup
git commit -m "Serve media files using Nginx"

# Push to GitHub
git push origin main
```

---

## Step 46 — Verify Media Files

Try opening a media file directly:

```txt
https://example.com/media/example.jpg
```

If the image loads, media serving is working.

---

## Step 47 — Fallback: Fix Serializer Image URL

If media files load directly but do not show on frontend, update serializer to return a relative path.

Example `products/serializers.py`:

```python
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_image(self, obj):
        return obj.image.url if obj.image else None
```

This returns:

```txt
/media/products/image.jpg
```

Instead of Docker internal URLs like:

```txt
http://backend:8000/media/products/image.jpg
```

Commit and push:

```sh
# Add serializer media URL fix
git add .

# Commit serializer fix
git commit -m "Fix media image URL in serializer"

# Push to GitHub
git push origin main
```

---

# 🧯 Useful DigitalOcean Docker Commands

Run these on DigitalOcean server inside `/opt/clickmart`:

```sh
# Show running containers
docker compose ps

# Show logs of all containers
docker compose logs

# Show backend logs only
docker compose logs backend

# Show nginx logs only
docker compose logs nginx

# Restart all containers
docker compose restart

# Restart only backend container
docker compose restart backend

# Restart only nginx container
docker compose restart nginx

# Rebuild and start containers in background
docker compose up --build -d

# Stop containers without deleting database volume
docker compose down

# Stop containers and delete database volume - warning: database data will be removed
docker compose down -v

# Enter backend container shell
docker compose exec backend sh

# Run Django migrations manually inside backend container
docker compose exec backend python manage.py migrate

# Run Django collectstatic manually inside backend container
docker compose exec backend python manage.py collectstatic --noinput

# Create Django superuser inside backend container
docker compose exec backend python manage.py createsuperuser
```

---

# ✅ Final Production Checklist

Before final launch, confirm:

- [ ] Project runs locally.
- [ ] Docker runs locally.
- [ ] Code pushed to GitHub.
- [ ] DigitalOcean Droplet created.
- [ ] Docker, Docker Compose, and Git installed on Droplet.
- [ ] Project cloned into `/opt/clickmart`.
- [ ] `.env.production` created on server.
- [ ] `.env.docker` created on server.
- [ ] `DEBUG=False` in production.
- [ ] `ALLOWED_HOSTS` includes domain and Droplet IP.
- [ ] Nginx reverse proxy working.
- [ ] Backend and frontend ports are not publicly exposed.
- [ ] Only ports `22`, `80`, `443` are open.
- [ ] Domain A records point to DigitalOcean Droplet IP.
- [ ] SSL installed and HTTPS working.
- [ ] Media files load properly.
- [ ] GitHub Actions auto-deploy works.

Congratulations 🎉 Your Django + React project is now deployed on DigitalOcean.
