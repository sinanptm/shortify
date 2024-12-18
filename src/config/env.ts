import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI!;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const PORT = process.env.PORT || 8000;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const GEOLOCATION_PROVIDER = process.env.GEOLOCATION_PROVIDER || "http://ip-api.com/json/";

export {
    NODE_ENV,
    MONGO_URI,
    CLIENT_URL,
    REDIS_HOST,
    PORT,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    REDIS_PORT,
    GEOLOCATION_PROVIDER
};