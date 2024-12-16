import cors from 'cors';
import express from 'express';
import connectDb from './config/connectDb';
import authRoutes from './presentation/routers/authRoutes';
import urlRoutes from './presentation/routers/urlRoutes';
import cookieParser from 'cookie-parser';
import { CLIENT_URL, PORT } from './config/env';
import connectRedis from './config/connectRedis';
import ErrorHandler from './presentation/middleware.ts/ErrorHandler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use("/api", authRoutes);
app.use("/api", urlRoutes);
app.use(new ErrorHandler().exec);

app.listen(PORT, () => {
    connectDb();
    connectRedis();
    console.log("Server start running");
});