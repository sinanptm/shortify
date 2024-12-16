import { StatusCode } from "@/types";
import AuthUseCase from "@/use_cases/AuthUseCase";
import { NextFunction, Request, Response } from "express";

export default class AuthController {
    constructor(
        private authUseCase: AuthUseCase
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
}