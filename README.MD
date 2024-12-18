# 🔗 Shortify - URL Shortener API

[![TypeScript](https://img.shields.io/badge/TypeScript-4.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Redis](https://img.shields.io/badge/Redis-4.x-red.svg)](https://redis.io/)
[![Jest](https://img.shields.io/badge/Jest-29.x-orange.svg)](https://jestjs.io/)
[![Passport](https://img.shields.io/badge/Passport-0.6-green.svg)](https://www.passportjs.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Authentication](#authentication)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)

## 🌐 Live Endpoints

- **Authentication Endpoint**: [https://shortify.avm-ayurvedic.online/api/auth/google](https://shortify.avm-ayurvedic.online/api/auth/google)
- **API Documentation**: [Postman Documentation](https://documenter.getpostman.com/view/32102231/2sAYHzGiKx)

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js 22.x or higher
- Redis Server (Install from [Redis Official Documentation](https://redis.io/docs/getting-started/))
- MongoDB
- Yarn package manager

## 🔐 Authentication

Shortify uses Passport.js with Google OAuth 2.0. Authentication is handled through:
- Browser-based Google OAuth flow (`/api/auth/google`)
- JWT tokens returned in both cookie and response body
- Support for both cookie-based and bearer token authentication

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

## 🛠 Tech Stack

### Core Technologies
- **Runtime**: Node.js 22.x
- **Language**: TypeScript 4.0
- **Framework**: Express 4.x
- **Database**: MongoDB with Mongoose
- **Caching**: Redis 4.x

### Security & Authentication
- **Auth Framework**: Passport.js
- **Strategy**: Google OAuth 2.0
- **Token Management**: JWT
- **Rate Limiting**: rate-limiter-flexible

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/shortify.git
   cd shortify
   yarn install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

3. **Start Redis**
   - Follow Redis setup instructions from [Redis Documentation](https://redis.io/docs/getting-started/)
   - Verify Redis is running: `redis-cli ping`

4. **Start Development Server**
   ```bash
   yarn dev
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

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## 📚 API Documentation

For detailed API documentation and endpoints, please visit our [Postman Documentation](https://documenter.getpostman.com/view/32102231/2sAYHzGiKx).
