import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import configurePassport from './config/configurePassport';
import ErrorHandler from './presentation/middlewares/ErrorHandler';
import authRoutes from './presentation/routers/authRoutes';
import { NODE_ENV, PORT, TOKEN_SECRET } from './config/env';
import connectDb from './config/connectDb';
import urlRoutes from './presentation/routers/urlRoutes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: TOKEN_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));



app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


app.use("/api", authRoutes);
app.use("/api", urlRoutes);
app.use(new ErrorHandler().exec);

app.listen(PORT, () => {
    connectDb();
    configurePassport();
    console.log('server started');
});