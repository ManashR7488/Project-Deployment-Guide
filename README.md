## Project Deployment Guide

This README outlines the steps to launch an AWS EC2 instance, secure SSH access, configure your server environment, deploy a Node.js application, and manage it with PM2.

### 📑 Table of Contents

1. [🔹 Prerequisites](#prerequisites)
2. [🚀 Launch an EC2 Instance](#launch-an-ec2-instance)
3. [🔒 Secure Your SSH Key (Windows)](#secure-your-ssh-key-windows)
4. [🔄 Update & Upgrade Server Packages](#update--upgrade-server-packages)
5. [🛠️ Install Node.js (LTS)](#install-nodejs-lts)
6. [📥 Clone Your Repository](#clone-your-repository)
7. [🗑️ Kill Processes on a Port](#kill-processes-on-a-port)
8. [⚙️ Manage Your App with PM2](#manage-your-app-with-pm2)
9. [📖 Further Steps](#further-steps)

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

<a name="further-steps"></a>

### 📖 Further Steps

* **Secure Server**: Disable password auth, configure UFW.
* **Reverse Proxy**: Configure NGINX for HTTPS and load balancing.
* **Domain Setup**: Point your domain and obtain SSL via Let's Encrypt.
* **CI/CD**: Automate deployments with GitHub Actions or other tools.

---

*Happy Deploying!* 🚀
