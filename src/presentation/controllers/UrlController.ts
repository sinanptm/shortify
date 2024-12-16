import { CustomRequest, StatusCode } from "@/types";
import CreateUrlUseCase from "@/use_cases/CreateUrlUseCase";
import { NextFunction, Response } from "express";

export default class UrlController {
    constructor(
        private createUrlUseCase: CreateUrlUseCase
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
}