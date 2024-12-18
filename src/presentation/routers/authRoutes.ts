import { Router } from 'express';
import passport from 'passport';
import { GoogleAuthController } from '../controllers/AuthController';
import AuthUseCase from '@/use_cases/auth/AuthUseCase';
import UserRepository from '@/infrastructure/repositories/UserRepository';
import TokenService from '@/infrastructure/service/TokenService';
import { CLIENT_URL } from '@/config/env';

const route = Router();

const userRepository = new UserRepository();
const tokenService = new TokenService();
const authUseCase = new AuthUseCase(userRepository, tokenService);

const googleAuthController = new GoogleAuthController(authUseCase);

route.get(
    '/auth/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);
route.get(
    '/auth/callback',
    passport.authenticate('google', { 
        failureRedirect: `${CLIENT_URL}/login`,
        session: false 
    }),
    googleAuthController.handleGoogleCallback.bind(googleAuthController)
);
route.get('/auth/logout', googleAuthController.logout.bind(googleAuthController));

export default route