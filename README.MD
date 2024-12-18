# 🔗 Shortify - URL Shortener API

[![TypeScript](https://img.shields.io/badge/TypeScript-4.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Redis](https://img.shields.io/badge/Redis-4.x-red.svg)](https://redis.io/)
[![Jest](https://img.shields.io/badge/Jest-29.x-orange.svg)](https://jestjs.io/)
[![Passport](https://img.shields.io/badge/Passport-0.6-green.svg)](https://www.passportjs.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Authentication](#authentication)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🔐 Authentication

Shortify implements a flexible authentication system using Passport.js with Google OAuth 2.0:

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

3. **Token Handling**:
   - Server sets HTTP-only cookie with JWT
   - Server also returns JWT in response body
   - Client can:
     - Rely on cookie-based auth (automatic)
     - Use JWT as Bearer token in Authorization header

### Token Usage

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

## 🛠 Tech Stack

### Core Technologies
- **Runtime**: Node.js 18.x
- **Language**: TypeScript 4.0
- **Framework**: Express 4.x
- **Database**: MongoDB with Mongoose
- **Caching**: Redis 4.x

### Security & Authentication
- **Auth Framework**: Passport.js
- **Strategy**: Google OAuth 2.0
- **Token Management**: JWT
- **Rate Limiting**: rate-limiter-flexible

### DevOps & Monitoring
- **Process Manager**: PM2
- **Logging**: Winston
- **Reverse Proxy**: Nginx
- **Cloud Platform**: AWS
- **Package Manager**: Yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shortify.git
   cd shortify
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

## 🌐 Deployment

### AWS Infrastructure

The application is deployed on AWS with the following setup:
- EC2 instance for application hosting
- Route 53 for DNS management
- CloudFront for CDN (optional)
- ACM for SSL certificate management

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name shortify.avm-ayurvedic.online;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name shortify.avm-ayurvedic.online;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## ⚙️ Environment Variables

```env
# Server Configuration
PORT=8000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/shortify
REDIS_URL=redis://localhost:6379

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://shortify.avm-ayurvedic.online/api/auth/google/callback
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret

# AWS Configuration
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## 📚 API Documentation

[API documentation section would go here]

## 🤝 Contributing

[Contributing guidelines would go here]

## 📄 License

[License information would go here]