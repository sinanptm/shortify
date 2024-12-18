import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '@/types';
import AuthUseCase from '@/use_cases/auth/AuthUseCase';

export class GoogleAuthController {
    constructor(private readonly authUseCase: AuthUseCase) {}

    handleGoogleCallback = async (req: Request, res: Response) => {
        try {            
            // User is authenticated by Passport.js at this point
            const user = req.user as {
                id: string,
                email: string,
                name: string;
            };

            // Generate tokens
            const { accessToken, refreshToken } = await this.authUseCase.authenticateGoogleUser(user);

            // Set refresh token as HTTP-only cookie
            res.cookie('auth_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });

            // Redirect to frontend with access token
            res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${accessToken}`);
        } catch (error) {
            console.log(error)
            res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
        }
    };

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.auth_token;

            if (!refreshToken) {
                 res.status(StatusCode.Unauthorized).json({
                    message: 'No refresh token provided'
                });
                return
            }

            const { accessToken } = await this.authUseCase.refreshAccessToken(refreshToken);

             res.status(StatusCode.Success).json({
                token: accessToken,
                message: 'Token refreshed successfully'
            });
        } catch (error) {
            next(error);
        }
    };

    logout = (req: Request, res: Response) => {
        // Clear the auth cookie
        res.clearCookie('auth_token');

        res.status(StatusCode.Success).json({
            message: 'Logged out successfully'
        });
    };
}