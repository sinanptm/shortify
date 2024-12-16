import { CustomRequest } from "@/types";
import CreateUrlUseCase from "@/use_cases/CreateUrlUseCase";
import { NextFunction, Response } from "express";

export default class UrlController {
    constructor(
        private createUrlUseCase: CreateUrlUseCase
    ) { }

    async createUrl(req: CustomRequest, res: Response, next: NextFunction) {
        try {

        } catch (err) {
            next(err);
        }
    }
}