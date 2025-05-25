# mobile-template
mobile template plus Auth

## Project structure
![image](https://github.com/user-attachments/assets/e795bec4-d522-4f6a-adc0-f1abd129f379)
# 🚀 Fullstack Mobile Application Monorepo

This repository hosts a fullstack mobile application built with an **Expo (React Native)** frontend and a **Node.js** backend. It's organized as a monorepo using **Yarn Berry (v2+) Workspaces**, providing a unified and efficient development environment.

---

## Project Overview

This monorepo consolidates related projects into a single repository:

* **`frontend/`**: Your mobile client, built with Expo (React Native).
* **`backend/`**: Your Node.js API, serving data and logic.

These projects are managed as [Yarn Workspaces](https://yarnpkg.com/features/workspaces) to facilitate **shared code**, **consistent dependency versions**, and a **streamlined development workflow**. Each workspace will maintain its own `node_modules` directory for optimal compatibility.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

* **Node.js**: **Version 16.10 or later** (LTS recommended). Corepack is bundled with Node.js starting from v14.19 and v16.9.
    * [Download Node.js](https://nodejs.org/en/)
* **Git**: Version control system.
    * [Download Git](https://git-scm.com/downloads)
* **Optional (for mobile development):**
    * **Expo Go App**: Install on your physical mobile device (Android/iOS) for quick testing.
    * **Android Studio**: For Android emulators and native development setup.
    * **Xcode**: For iOS simulators and native development setup (macOS only).

---

## Getting Started

Follow these steps precisely to set up and run the project locally.

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone <your-repository-url>
cd <your-repository-name> # e.g., cd fullstack-mobile-app
```

## 2. Enable Corepack
Corepack is essential for Yarn Berry and only needs to be enabled once per system.

Important: On Windows, open your terminal (Command Prompt or PowerShell) as Administrator for this command to avoid permission errors.

---
```
corepack enable 

```
## 3. Initial Monorepo Setup
This step sets up the root of your monorepo.

Ensure you are in the monorepo root (e.g., C:\Users\user\Desktop\fullstack-mobile-app).

Initialize package.json for the monorepo: This creates a basic package.json file.

```
yarn init -y
```
### Edit the root package.json to define your workspaces. Open package.json in a text editor and update it to include "private": true and the "workspaces" array:
```
// C:\Users\user\Desktop\fullstack-mobile-app\package.json
{
  "name": "fullstack-mobile-app",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "private": true, // <--- CRUCIAL for monorepo roots
  "workspaces": [
    "frontend",   // <--- Your Expo app workspace
    "backend"     // <--- Your Node.js API workspace
  ],
  "scripts": {
    // Add root-level scripts here if needed, e.g., "start-all": "yarn workspace backend dev & yarn workspace frontend start"
  }
}
```
- Set the Yarn version for the monorepo: This command downloads the Yarn Berry binary into your .yarn/releases folder and adds packageManager to your root package.json.
  ```
  yarn set version stable
  ```
- 4. Create Frontend (Expo) Workspace
Navigate to the monorepo root (e.g., C:\Users\user\Desktop\fullstack-mobile-app).
Create the frontend directory and navigate into it:
```
mkdir frontend
cd frontend
yarn create expo-app .
```
- Go back to the monorepo root:
  ```
  cd ..
  ```
### 5. Create Backend (Node.js) Workspace
Ensure you are at the monorepo root.
Create the backend directory and initialize it:

```
mkdir backend
cd backend
yarn init -y
```
- Go back to the monorepo root
```
cd ..
```
### 6. Finalize node_modules Configuration
To ensure each workspace gets its own node_modules folder (essential for Expo and often preferred for Node.js projects), we'll explicitly configure the nodeLinker.
- For frontend:
Navigate into frontend/ (cd frontend).
Open frontend/.yarnrc.yml (it should already exist from create-expo-app).
Verify it contains: nodeLinker: node-modules. Save.
Go back to the monorepo root (cd ..).
- For backend:
Navigate into backend/ (cd backend).
Create a new file named .yarnrc.yml if it doesn't exist.
Add the following content:
```
# backend/.yarnrc.yml
nodeLinker: node-modules
```
- Run the unified install command in Root :
```
yarn install
```

- Frontend (Expo Mobile App)
To start the Expo development server:
```
# Navigate to the frontend workspace
cd frontend
yarn start
# Or, from the monorepo root:
# yarn workspace frontend start
```

- Backend
```
# Navigate to the backend workspace
cd backend
yarn dev
# Or, from the monorepo root:
# yarn workspace backend dev
```# mobile-template
