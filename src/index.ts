import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { configurePassport } from './config/configPassport'; 
import ErrorHandler from './presentation/middlewares/ErrorHandler';
import authRoutes from './presentation/routers/authRoutes';
import { PORT } from './config/env';
import UserRepository from './infrastructure/repositories/UserRepository';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

(async function(){
    const re = new UserRepository();

    console.log('sdfa',await re.findByEmail('asdf')
);
    

})()

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

configurePassport();

app.use("/api", authRoutes);
app.use(new ErrorHandler().exec);

app.listen(PORT,()=>{
    console.log('asta');
    
})