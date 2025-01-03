import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '@/types';
import AuthUseCase from '@/use_cases/auth/AuthUseCase';
import { NODE_ENV } from '@/config/env';

export class GoogleAuthController {
    constructor(private readonly authUseCase: AuthUseCase) { }

    async handleGoogleCallback(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user as {
                id: string,
                email: string,
                name: string;
            };

            const { token } = await this.authUseCase.authenticateGoogleUser(user);

            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.status(StatusCode.Success).json({
                message: 'Authentication successful. You can now use the auth_token as a cookie or in the Authorization header as a Bearer token.',
                token, 
                auth_token_info: {
                  cookie_name: 'auth_token',
                  description: 'Store this token in the Authorization header for API requests as Bearer token.',
                },
              });
        } catch (error) {
            next(error);
        }
    };


    logout(req: Request, res: Response) {
        res.clearCookie('auth_token');

        res.status(StatusCode.Success).json({
            message: 'Logged out successfully'
        });
    };
}