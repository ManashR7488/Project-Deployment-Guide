## Project Deployment Guide

This README outlines the steps to launch an AWS EC2 instance, secure SSH access, configure your server environment, deploy a Node.js application, and manage it with PM2.

### 📑 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Launch an EC2 Instance](#launch-an-ec2-instance)
3. [Secure Your SSH Key (Windows)](#secure-your-ssh-key-windows)
4. [Update & Upgrade Server Packages](#update--upgrade-server-packages)
5. [Install Node.js (LTS)](#install-nodejs-lts)
6. [Clone Your Repository](#clone-your-repository)
7. [Kill Processes on a Port](#kill-processes-on-a-port)
8. [Manage Your App with PM2](#manage-your-app-with-pm2)
9. [Enable HTTPS with NGINX & Certbot](#enable-https-with-nginx--certbot)
10. [CI-CD Deployment with GitHub Actions](#ci-cd-deployment-with-github-actions)

---

<a name="prerequisites"></a>

### 🔹 Prerequisites

* ☁️ An AWS account with permissions to create EC2 instances and security groups.

* 💻 AWS CLI (optional) or access to the AWS Management Console.

* 🖥️ Local environment with PowerShell (Windows) or a Unix shell.

* 🗂️ Git installed on your local machine or server.

* 🔐 GitHub account (for private repository access).

---

<a name="launch-an-ec2-instance"></a>

### 🚀 1. Launch an EC2 Instance

1. Create an **EC2 instance** (e.g., Ubuntu 22.04 LTS).
2. Create or select a **Key Pair** (.pem file).
3. Create a **Security Group** allowing:

   * SSH (port 22)
   * HTTP (port 80)
   * (Optional) HTTPS (port 443)
   * **Custom application ports** (e.g., TCP 3000, 5000) for your Node.js app
     **To configure inbound rules in AWS Console:**
   * Go to **EC2 Dashboard** → **Security Groups**
   * Select your security group and click **Edit inbound rules**
   * Click **Add rule**
   * For **Type**, choose **Custom TCP**
   * In **Port range**, enter your application port (e.g., 3000)
   * (Optional) Repeat for additional ports (e.g., 5000)
   * Click **Save rules**

---

<a name="secure-your-ssh-key-windows"></a>

### 🔒 2. Secure Your SSH Key (Windows) (Windows)

```powershell
cd C:\path\to\keys
# Remove inherited permissions
icacls "Key-path.pem" /inheritance:r
# Grant read access to your user
icacls "Key-path.pem" /grant:r $env:USERNAME`:R
```

**Connect to EC2**:

```bash
ssh -i "Key-path.pem" ubuntu@<EC2_PUBLIC_DNS>
```

---

<a name="update--upgrade-server-packages"></a>

### 🔄 3. Update & Upgrade Server Packages

```bash
sudo apt update && sudo apt upgrade -y
```

---

<a name="install-nodejs-lts"></a>

### 🛠️ 4. Install Node.js (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

---

<a name="clone-your-repository"></a>

### 📥 5. Clone Your Repository

#### Public Repository

```bash
git clone <clone-URL>
```

#### Private Repository (SSH)

1. Generate a new SSH key:

   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
2. Copy the public key:

   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
3. Add the key to GitHub > **Settings** > **SSH and GPG keys**.
4. Test your SSH connection:

   ```bash
   ssh -T git@github.com
   ```
5. Clone via SSH:

   ```bash
   git clone git@github.com:username/repo.git
   ```

---

<a name="kill-processes-on-a-port"></a>

### 🗑️ 6. Kill Processes on a Port

**Find and kill a process on port 3000**:

```bash
sudo lsof -i :3000          # List process using port
sudo kill -9 <PID>          # Kill by PID
# Or single line:
sudo kill -9 $(sudo lsof -t -i:3000)
```

---

<a name="manage-your-app-with-pm2"></a>

### ⚙️ 7. Manage Your App with PM2

1. **Install PM2**:

   ```bash
   sudo npm install -g pm2
   ```

2. **Common Commands**:

   ```bash
   pm2 start index.js --name my-app    # Start app
   pm2 list                           # List running processes
   pm2 save                           # Save process list for restart
   pm2 startup                        # Generate startup script
   pm2 logs                           # View logs
   pm2 stop my-app                    # Stop the app
   pm2 delete my-app                  # Remove from PM2 list
   ```

---

<a name="enable-https-with-nginx--certbot"></a>

## Enable HTTPS with NGINX & Certbot

### A. For Domain (Let’s Encrypt SSL)

#### 1. Install NGINX

```sh
sudo apt install -y nginx
```

#### 2. Allow HTTPS in UFW

```sh
sudo ufw allow 'Nginx Full'
```

#### 3. Configure NGINX Reverse Proxy

```sh
sudo nano /etc/nginx/sites-available/myapp
```

Paste the following (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then enable:

```sh
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. Install Certbot & Get SSL

```sh
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### 5. SSL Auto-Renewal (Default)

Certbot adds auto-renewal via cron. You can verify:

```sh
sudo certbot renew --dry-run
```

---

### B. For IP Address (Self-Signed SSL)

Since Let’s Encrypt does not issue certificates for IPs:

#### 1. Generate Self-Signed Cert

```sh
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt
```

#### 2. Create NGINX Config

```sh
sudo nano /etc/nginx/sites-available/myapp
```

Paste:

```nginx
server {
    listen 443 ssl;
    server_name your_server_ip;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name your_server_ip;
    return 301 https://$host$request_uri;
}
```

Enable & restart:

```sh
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

You can now visit `https://your_server_ip` with a browser warning (self-signed cert).

---

<a name="ci-cd-deployment-with-github-actions"></a>

## ⚙️ CI/CD Deployment with GitHub Actions and EC2

This project uses a secure and automated CI/CD pipeline using **GitHub Actions** to deploy to an **AWS EC2** instance on every push to the `main` branch.

---

### 🔐 Step 1: Generate SSH Key Pair (on your local machine)

Run this command in your local terminal (not inside EC2):

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

* When prompted for file name, type:

  ```
  ec2-deploy-key
  ```
* Two files will be created:

  * `ec2-deploy-key` (this is your **private key**)
  * `ec2-deploy-key.pub` (this is your **public key**)
* Do **NOT** set a passphrase when asked.

---

### 📋 Step 2: Add Public Key to EC2 Instance

1. SSH into your EC2:

```bash
ssh -i your-original-key.pem ubuntu@<your-ec2-ip>
```

2. On your EC2 machine, run:

```bash
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
```

3. Paste the **content of `ec2-deploy-key.pub`** here and save.

4. Set permissions:

```bash
chmod 600 ~/.ssh/authorized_keys
```

---

### 🔑 Step 3: Add Private Key to GitHub Secrets

In your GitHub repository:

1. Go to **Settings → Secrets → Actions**
2. Add the following secrets:

| Secret Name   | Value                                      |
| ------------- | ------------------------------------------ |
| `EC2_SSH_KEY` | Contents of `ec2-deploy-key` (private key) |
| `EC2_USER`    | `ubuntu`                                   |
| `EC2_HOST`    | Your EC2 instance public IP                |
| `TARGET_DIR`  | e.g., `/home/ubuntu/code/projectRepo`           |

---

### ⚙️ Step 4: Setup GitHub Actions Workflow

Create the file: `.github/workflows/deploy.yml`

```yaml
name: Deploy to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/ec2-deploy-key
          chmod 400 ~/.ssh/ec2-deploy-key
          ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy to EC2 Server
        run: |
          ssh -i ~/.ssh/ec2-deploy-key ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} << 'EOF'
            cd ${{ secrets.TARGET_DIR }}
            git pull origin main
            npm install
            pm2 restart all || pm2 start index.js --name nameOfServive
          EOF
```

---

### ✅ Step 5: Push the Workflow to GitHub

Once you have created or edited the `deploy.yml` file, push it to your repository:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD deployment workflow"
git push origin main
```

Now your CI/CD pipeline is fully functional and will trigger on every push to the `main` branch.

---

### ✅ CI/CD in Action

Whenever you push to the `main` branch, GitHub Actions will:

* Connect to your EC2 using SSH
* Pull the latest code
* Install dependencies
* Restart the app with PM2

To check logs:

* Go to **GitHub → Actions Tab** in your repo

To verify deployment:

* Visit: `http://<your-ec2-ip>:3000`

---



*Happy Deploying!* 🚀
