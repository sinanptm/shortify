import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI!;
const CLIENT_URL = process.env.CLIENT_URL!;
const PORT = process.env.PORT || 8000;
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export {
    NODE_ENV,
    MONGO_URI,
    CLIENT_URL,
    REDIS_URL,
    PORT,
};