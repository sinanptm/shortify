# 🔗 Shortify - URL Shortener API

[![TypeScript](https://img.shields.io/badge/TypeScript-4.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Redis](https://img.shields.io/badge/Redis-4.x-red.svg)](https://redis.io/)
[![Jest](https://img.shields.io/badge/Jest-29.x-orange.svg)](https://jestjs.io/)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Environment Variables](#environment-variables)

## 🎯 Overview

Shortify is a scalable URL shortener API that provides advanced analytics, Google Sign-In authentication, and rate limiting. The system allows users to create and manage shortened URLs with detailed tracking and analytics capabilities.

🌐 **Live Demo**: [https://shortify.avm-ayurvedic.online](https://shortify.avm-ayurvedic.online/api/auth/google)  
📚 **API Documentation**: [Postman Documentation](https://documenter.getpostman.com/view/32102231/2sAYHzGiKx#bd9ed592-d807-4be9-b519-83a94ff1bac6)

## ✨ Features

### 🔐 Authentication
- Google Sign-In integration
- Secure JWT-based session management

### 🔗 URL Management
- Create shortened URLs with optional custom aliases
- Topic-based URL grouping (acquisition, activation, retention)
- Custom alias support
- Rate limiting protection

### 📊 Analytics
- Comprehensive click tracking
- Device and OS analytics
- Unique visitor tracking
- Time-based analytics
- Topic-based performance metrics

### ⚡ Performance
- Redis caching implementation
- Rate limiting
- Scalable architecture

## 🛠 Tech Stack

- **Backend Framework**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Caching**: Redis
- **Testing**: Jest
- **Authentication**: Google OAuth + JWT
- **Package Manager**: Yarn
- **Rate Limiting**: rate-limiter-flexible
- **Logging**: Winston

## 🌐 Deployment

The application is deployed on AWS with the following setup:
- Nginx as a reverse proxy for handling requests
- SSL/HTTPS configuration through Nginx
- Subdomain configuration: `shortify.avm-ayurvedic.online`
- PM2 for process management

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


## 📁 Project Structure

```
├── .github/                  # GitHub workflows and configurations
├── logs/                     # Application logs
├── src/
│   ├── config/              # Configuration files
│   ├── domain/              # Domain entities and interfaces
│   ├── infrastructure/      # External services implementation
│   ├── presentation/        # Controllers and routes
│   ├── types/              # TypeScript type definitions
│   ├── use_cases/          # Application business logic
│   ├── utils/              # Utility functions
│   └── index.ts            # Application entry point
├── tests/                   # Test files
├── .env                     # Environment variables
├── jest.config.js          # Jest configuration
├── nodemon.json            # Nodemon configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/sinanptm/shortify
cd shortify
```

2. **Install dependencies**
```bash
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
yarn dev
```

5. **Build for production**
```bash
yarn build
yarn start
```

## 🧪 Testing

Run tests using Jest:

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test --coverage
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# General Environment
NODE_ENV=DEV

# Database
MONGO_URI=mongodb://localhost:27017/Shortify

# Client and Server URLs
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:8000

# Port Configuration
PORT=8000

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# JWT Secrets
TOKEN_SECRET=your_TOKEN_SECRET

# Geolocation Provider
GEOLOCATION_PROVIDER=http://ip-api.com/json/

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

```

## 📦 Available Scripts

```bash
yarn dev        # Start development server
yarn build      # Build the project
yarn start      # Start production server
yarn test       # Run tests
yarn clean      # Clean build directory
```


Built with ❤️  using Clean Architecture and Domain-Driven Design principles