import { CustomRequest, StatusCode } from "@/types";
import CreateUrlUseCase from "@/use_cases/CreateUrlUseCase";
import RedirectUseCase from "@/use_cases/RedirectUseCase";
import { NextFunction, Response } from "express";

export default class UrlController {
    constructor(
        private createUrlUseCase: CreateUrlUseCase,
        private redirectUseCase: RedirectUseCase
    ) { }

    async createUrl(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { longUrl, topic, customAlias } = req.body;
            const userId = req.user?.id;
            const url = await this.createUrlUseCase.exec(userId!, longUrl, topic, customAlias);

            res.status(StatusCode.Created).json({ message: "Url has created", url });
        } catch (err) {
            next(err);
        }
    }

    async handleRedirect(req: CustomRequest, res: Response, next:NextFunction) {
        try {
            const alias = req.params.alias;
            const longUrl = await this.redirectUseCase.exec(alias, req);
            
            res.redirect(StatusCode.Redirect, longUrl);
        } catch (error) {
            next(error)
        }
    }
}
