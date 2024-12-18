import { StatusCode } from "@/types";
import CreateUrlUseCase from "@/use_cases/CreateUrlUseCase";
import GetOverallAnalyticsUseCase from "@/use_cases/GetOverallAnalyticsUseCase";
import GetTopicAnalytics from "@/use_cases/GetTopicAnalyticsUseCase";
import GetUrlAnalyticsUseCase from "@/use_cases/GetUrlAnalyticsUseCase";
import RedirectUseCase from "@/use_cases/RedirectUseCase";
import { NextFunction, Response, Request } from "express";

export default class UrlController {
    constructor(
        private readonly createUrlUseCase: CreateUrlUseCase,
        private readonly redirectUseCase: RedirectUseCase,
        private readonly getAnalyticsUseCase: GetUrlAnalyticsUseCase,
        private readonly getTopicAnalyticsUseCase: GetTopicAnalytics,
        private readonly getOverallAnalyticsUseCase: GetOverallAnalyticsUseCase
    ) { }

    async createUrl(req: Request, res: Response, next: NextFunction) {
        try {
            const { longUrl, topic, customAlias } = req.body;
            const userId = (req.user as {id:string}).id;
            const url = await this.createUrlUseCase.exec(userId!, longUrl, topic, customAlias);

            res.status(StatusCode.Created).json({ message: "Url has created", url });
        } catch (err) {
            next(err);
        }
    }

    async handleRedirect(req: Request, res: Response, next: NextFunction) {
        try {
            const alias = req.params.alias;
            const longUrl = await this.redirectUseCase.exec(alias, req);

            res.redirect(StatusCode.Redirect, longUrl);
        } catch (error) {
            next(error);
        }
    }

    async getUrlAnalytics(req: Request, res: Response, next: NextFunction) {
        try {
            const alias = req.params.alias;
            const analytics = await this.getAnalyticsUseCase.exec(alias);

            res.status(StatusCode.Success).json(analytics);
        } catch (error) {
            next(error);
        }
    }

    async getTopicAnalytics(req: Request, res: Response, next: NextFunction) {
        try {
            const topic = req.params.topic;
            const analytics = await this.getTopicAnalyticsUseCase.exec(topic);

            res.status(StatusCode.Success).json(analytics);
        } catch (error) {
            next(error);
        }
    }

    async getOverallAnalytics(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req.user as {id:string}).id;
            const analytics = await this.getOverallAnalyticsUseCase.exec(userId);

            res.status(StatusCode.Success).json(analytics);
        } catch (error) {
            next(error);
        }
    }
}
