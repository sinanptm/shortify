# 🔗 Shortify - URL Shortener API

[![TypeScript](https://img.shields.io/badge/TypeScript-4.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Redis](https://img.shields.io/badge/Redis-4.x-red.svg)](https://redis.io/)
[![Jest](https://img.shields.io/badge/Jest-29.x-orange.svg)](https://jestjs.io/)
[![Passport](https://img.shields.io/badge/Passport-0.6-green.svg)](https://www.passportjs.org/)

## 📚 Contents
[📖 Overview](#-overview) | 
[⚙️ Prerequisites](#%EF%B8%8F-prerequisites) | 
[🛠 Tech Stack](#-tech-stack) | 
[📊 Features](#-features) | 
[🔌 API Endpoints](#-api-endpoints) | 
[🔐 Authentication Setup](#-authentication-setup) | 
[⚙️ Environment Variables](#%EF%B8%8F-environment-variables) | 
[🚀 Installation](#-installation) | 
[🧪 Testing](#-testing) | 
[📚 API Documentation](#-api-documentation)

## 📖 Overview

Shortify is a powerful URL shortening service built with scalability and analytics in mind. It provides advanced features including topic-based organization, detailed analytics, and Google Sign-In authentication, making it perfect for both personal and enterprise use.

## 🌐 Live Endpoints

- **Authentication Endpoint**: [https://shortify.avm-ayurvedic.online/api/auth/google](https://shortify.avm-ayurvedic.online/api/auth/google)
- **API Documentation**: [Postman Documentation](https://documenter.getpostman.com/view/32102231/2sAYHzGiKx)

## 🛠 Tech Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Caching**: Redis
- **Authentication**: Passport.js with Google OAuth 2.0
- **Testing**: Jest
- **Containerization**: Docker
- **Analytics**: Custom implementation with geolocation tracking

## ⚙️ Prerequisites

Before running the application, ensure you have:

- Node.js 22.x or higher
- Redis Server
- MongoDB
- Yarn package manager
- Google Cloud Console account

## 📊 Features

### 1. User Authentication
- Google Sign-In integration
- Secure session management
- JWT token-based authentication
- HTTP-only cookie implementation

### 2. URL Shortening
- Custom alias support
- Topic-based organization
- Automatic URL validation
- Collision detection
- Rate limiting protection

### 3. Advanced Analytics
- **Click Tracking**
  - Total clicks
  - Unique visitors
  - Geographic distribution
  - Time-based analytics

- **Device Analytics**
  - Operating system tracking
  - Device type detection
  - Browser statistics
  - Screen resolution data

- **Topic-Based Insights**
  - Category-wise performance
  - Comparative analytics
  - Trend analysis
  - Engagement metrics

### 4. Performance Features
- Redis caching
- Load balancing ready
- Rate limiting
- Response compression

### 5. Security Measures
- URL sanitization
- XSS protection
- Rate limiting
- CORS configuration
- Input validation

## 🔌 API Endpoints

### Authentication
```javascript
GET /api/auth/google
GET /api/auth/callback
```

### URL Management
```javascript
POST /api/shorten
{
  "longUrl": "https://example.com",
  "customAlias": "my-link",
  "topic": "acquisition"
}

GET /api/shorten/:alias
```

### Analytics
```javascript
GET /api/analytics/alias/:alias
GET /api/analytics/topic/:topic
GET /api/analytics/overall
```

## 🔐 Authentication Setup

### Google OAuth Configuration

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google+ API and OAuth API

2. **Configure OAuth Consent Screen**:
   - Set application name
   - Add authorized domains
   - Configure scopes (email, profile)

3. **Get OAuth Credentials**:
   - Create OAuth Client ID
   - Configure redirect URIs
   - Save Client ID and Secret

## ⚙️ Environment Variables

```env
# Environment Configuration
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/Shortify
CLIENT_URL=http://localhost:3000
PORT=8000

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Security
TOKEN_SECRET=your_jwt_secret_key

# External Services
GEOLOCATION_PROVIDER=http://ip-api.com/json/

# URLs
SERVER_URL=http://localhost:8000

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

## 🚀 Installation

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

4. Start development server:
```bash
yarn dev
```

## 🧪 Testing

Run the test suite:
```bash
yarn test
```

## 📚 API Documentation

For detailed API documentation and examples, visit our [Postman Documentation](https://documenter.getpostman.com/view/32102231/2sAYHzGiKx).
