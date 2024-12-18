# 🔗 Shortify - URL Shortener API

[![TypeScript](https://img.shields.io/badge/TypeScript-4.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Redis](https://img.shields.io/badge/Redis-4.x-red.svg)](https://redis.io/)
[![Jest](https://img.shields.io/badge/Jest-29.x-orange.svg)](https://jestjs.io/)
[![Passport](https://img.shields.io/badge/Passport-0.6-green.svg)](https://www.passportjs.org/)

## 📋 Table of Contents
[Previous sections remain the same...]

## 🛠 Tech Stack

- **Backend Framework**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Caching**: Redis
- **Testing**: Jest
- **Authentication**: Passport.js with Google OAuth 2.0
- **Package Manager**: Yarn
- **Rate Limiting**: rate-limiter-flexible
- **Logging**: Winston
- **Reverse Proxy**: Nginx
- **Hosting**: AWS

## 🌐 Deployment

The application is deployed on AWS with the following setup:
- Nginx as a reverse proxy for handling requests
- SSL/HTTPS configuration through Nginx
- Subdomain configuration: `shortify.avm-ayurvedic.online`
- PM2 for process management

### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name shortify.avm-ayurvedic.online;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔐 Authentication Implementation

Authentication is implemented using Passport.js with Google OAuth 2.0 strategy:
- Passport.js for handling authentication flow
- Google OAuth 2.0 for secure user authentication
- JWT tokens for session management
- Secure cookie handling for token storage

Example authentication flow:
1. User initiates Google login
2. Passport.js handles OAuth flow
3. User information is received from Google
4. JWT tokens are generated and stored
5. Secure session is established

## ⚙️ Environment Variables

```env
# Previous environment variables remain the same...

# Google OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://shortify.avm-ayurvedic.online/api/auth/google/callback

# Cookie settings
COOKIE_SECRET=your_cookie_secret

# AWS specific configurations
AWS_REGION=your_aws_region
```

[Rest of the README remains the same...]