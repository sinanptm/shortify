import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "DEV";
const MONGO_URI = process.env.MONGO_URI! || "mongodb://localhost:27017/Shortify";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const PORT = process.env.PORT || 8000;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const TOKEN_SECRET = process.env.TOKEN_SECRET || "my_super_secret_key";
const GEOLOCATION_PROVIDER = process.env.GEOLOCATION_PROVIDER || "http://ip-api.com/json/";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000";
const GOOGLE_CLIENT_ID= process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET =  process.env.GOOGLE_CLIENT_SECRET!

export {
    NODE_ENV,
    MONGO_URI,
    CLIENT_URL,
    REDIS_HOST,
    PORT,
    TOKEN_SECRET,
    REDIS_PORT,
    GEOLOCATION_PROVIDER,
    GOOGLE_CLIENT_ID, 
    GOOGLE_CLIENT_SECRET,
    SERVER_URL
};
