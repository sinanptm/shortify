import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI!;
const CLIENT_URL = process.env.CLIENT_URL ||"http://localhost:3000";
const PORT = process.env.PORT || 8000;
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export {
    NODE_ENV,
    MONGO_URI,
    CLIENT_URL,
    REDIS_URL,
    PORT,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
};