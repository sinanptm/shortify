import { Router } from 'express';
import passport from 'passport';
import { GoogleAuthController } from '../controllers/AuthController';
import AuthUseCase from '@/use_cases/auth/AuthUseCase';
import UserRepository from '@/infrastructure/repositories/UserRepository';
import TokenService from '@/infrastructure/service/TokenService';

const route = Router();

const userRepository = new UserRepository();
const tokenService = new TokenService();
const authUseCase = new AuthUseCase(userRepository, tokenService);

const googleAuthController = new GoogleAuthController(authUseCase);

// Initiate Google OAuth authentication
route.get(
    '/auth/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

// Google OAuth callback route
route.get(
    '/auth/callback',
    passport.authenticate('google', { 
        failureRedirect: `${process.env.CLIENT_URL}/login`, 
        session: false 
    }),
    googleAuthController.handleGoogleCallback.bind(googleAuthController)
);

// Logout route
route.post('/auth/logout', googleAuthController.logout.bind(googleAuthController));

// Refresh token route
route.post('/auth/refresh', googleAuthController.refreshToken.bind(googleAuthController));

export default route;