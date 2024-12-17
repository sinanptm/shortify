import { CustomRequest, StatusCode } from "@/types";
import CreateUrlUseCase from "@/use_cases/CreateUrlUseCase";
import GetTopicAnalytics from "@/use_cases/GetTopicAnalytics";
import GetUrlAnalyticsUseCase from "@/use_cases/GetUrlAnalyticsUseCase";
import RedirectUseCase from "@/use_cases/RedirectUseCase";
import { NextFunction, Response } from "express";

export default class UrlController {
    constructor(
        private readonly createUrlUseCase: CreateUrlUseCase,
        private readonly redirectUseCase: RedirectUseCase,
        private readonly getAnalyticsUseCase: GetUrlAnalyticsUseCase,
        private readonly getTopicAnalyticsUseCase: GetTopicAnalytics
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

    async handleRedirect(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const alias = req.params.alias;
            const longUrl = await this.redirectUseCase.exec(alias, req);

            res.redirect(StatusCode.Redirect, longUrl);
        } catch (error) {
            next(error);
        }
    }

    async getUrlAnalytics(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const alias = req.params.alias;
            const analytics = await this.getAnalyticsUseCase.exec(alias);

            res.status(StatusCode.Success).json(analytics);
        } catch (error) {
            next(error);
        }
    }

    async getTopicAnalytics(req: CustomRequest, res: Response, next: NextFunction){
        try {
            const topic = req.params.topic;
            const analytics = await this.getTopicAnalyticsUseCase.exec(topic);

            res.status(StatusCode.Success).json(analytics);
        } catch (error) {
            next(error)
        }
    }
}
