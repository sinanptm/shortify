# 🔗 Shortify - URL Shortener API

[![TypeScript](https://img.shields.io/badge/TypeScript-4.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Redis](https://img.shields.io/badge/Redis-4.x-red.svg)](https://redis.io/)
[![Jest](https://img.shields.io/badge/Jest-29.x-orange.svg)](https://jestjs.io/)
[![Passport](https://img.shields.io/badge/Passport-0.6-green.svg)](https://www.passportjs.org/)

## 📚 Contents  
[Overview](#overview) | [Features](#features) | [Prerequisites](#prerequisites) | [Authentication Setup](#authentication-setup) | [Tech Stack](#tech-stack) | [Getting Started](#getting-started) | [Environment Variables](#environment-variables) 


## 🌐 Live Endpoints

- **Authentication Endpoint**: [https://shortify.avm-ayurvedic.online/api/auth/google](https://shortify.avm-ayurvedic.online/api/auth/google)
- **API Documentation**: [Postman Documentation](https://documenter.getpostman.com/view/32102231/2sAYHzGiKx)

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js 22.x or higher
- Redis Server (Install from [Redis Official Documentation](https://redis.io/docs/getting-started/))
- MongoDB
- Yarn package manager
- Google Cloud Console account (for OAuth credentials)

### Security & Authentication
- **Auth Framework**: Passport.js
- **Strategy**: Google OAuth 2.0
- **Token Management**: JWT
- **Rate Limiting**: rate-limiter-flexible

### DevOps & CI/CD
- **Continuous Integration**: GitHub Actions
- **Continuous Deployment**: Automated deployment to AWS
- **Code Quality**: Automated testing and linting
- **Branch Protection**: Required status checks

## 🔐 Authentication Setup

### Google OAuth Configuration

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API and Google OAuth API

2. **Configure OAuth Consent Screen**:
   - Go to "OAuth consent screen"
   - Set application name, authorized domains
   - Add necessary scopes (email, profile)

3. **Get OAuth Credentials**:
   - Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
   - Choose "Web application"
   - Add authorized origins (e.g., `http://localhost:8000`, `https://your-domain.com`)
   - Add authorized redirect URIs:
     ```
     http://localhost:8000/api/auth/google/callback
     https://your-domain.com/api/auth/google/callback
     ```
   - Save your Client ID and Client Secret

### Authentication Flow

1. **Browser-side Authentication**:
   - User initiates Google login from the client application
   - Client redirects to `/api/auth/google`
   - Google OAuth consent screen is displayed
   - User authenticates with Google

2. **Server Processing**:
   ```mermaid
   sequenceDiagram
      Client->>Server: Initiate Google OAuth
      Server->>Google: Redirect to consent
      Google->>Server: Return user data
      Server->>Client: Set HTTP-only cookie & return JWT
   ```

3. **Token Usage**:
   ```javascript
   // Cookie-based auth (automatic)
   fetch('/api/urls', {
     credentials: 'include' // Sends cookies automatically
   });

   // Bearer token auth
   fetch('/api/urls', {
     headers: {
       'Authorization': `Bearer ${jwt}`
     }
   });
   ```

[Previous sections remain the same...]

## ⚙️ Environment Variables

```env
# Environment Configuration
NODE_ENV=development

# MongoDB URI
MONGO_URI=mongodb://localhost:27017/Shortify

# Client URL
CLIENT_URL=http://localhost:3000

# Server Port
PORT=8000

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# JWT Token Secret
TOKEN_SECRET=my_super_secret_key

# Geolocation Provider
GEOLOCATION_PROVIDER=http://ip-api.com/json/

# Server URL
SERVER_URL=http://localhost:8000

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

```
### Installation Guide

⚠️ **IMPORTANT**: Make sure Redis server is running before starting the application. Without Redis, the URL shortener will not function properly.

## Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/sinanptm/shortify.git
cd shortify
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
yarn dev
```

## 📚 API Documentation

For detailed API documentation and endpoints, please visit our [Postman Documentation](https://documenter.getpostman.com/view/32102231/2sAYHzGiKx).
