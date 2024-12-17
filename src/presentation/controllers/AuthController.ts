import { AuthorizationError } from "@/domain/entities/CustomErrors";
import { StatusCode } from "@/types";
import AuthUseCase from "@/use_cases/auth/AuthUseCase";
import { NextFunction, Request, Response } from "express";

export default class AuthController {
    constructor(
        private readonly authUseCase: AuthUseCase
    ) { }

    async exec(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, name } = req.body;

            const { accessToken, refreshToken } = await this.authUseCase.exec(email, name);

            res.cookie("auth_token", refreshToken, {
                secure: true,
                sameSite: "strict",
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.status(StatusCode.Success).json({ token: accessToken, message: "Signin successful" });
        } catch (error) {
            next(error);
        }
    }

    async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { auth_token } = req.cookies;
            if (!auth_token) throw new AuthorizationError();

            const { accessToken } = await this.authUseCase.refreshAccessToken(auth_token);
            res.status(StatusCode.Success).json({ accessToken });

        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response) {
        const { patientToken } = req.cookies;
        if (!patientToken) {
            res.sendStatus(StatusCode.NoContent);
            return
        }

        res.clearCookie('auth_token', {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        res.status(StatusCode.Success).json({ message: "Cookie cleared" });
    }
}