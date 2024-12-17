import { Router } from 'express';
import UrlController from '../controllers/UrlController';
import RedirectUseCase from '@/use_cases/RedirectUseCase';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import CreateUrlUseCase from '@/use_cases/CreateUrlUseCase';
import TokenService from '@/infrastructure/service/TokenService';
import NanoIdService from '@/infrastructure/service/NanoIdService';
import { CacheService } from '@/infrastructure/service/CacheService';
import GetUrlAnalyticsUseCase from '@/use_cases/GetUrlAnalyticsUseCase';
import UrlRepository from '@/infrastructure/repositories/UrlRepository';
import RateLimiterMiddleware from '../middlewares/RateLimiterMiddleware';
import UserRepository from '@/infrastructure/repositories/UserRepository';
import ValidatorService from '@/infrastructure/service/ValidatorService';
import GeolocationService from '@/infrastructure/service/GeoLocationService';
import ClickAnalyticsRepository from '@/infrastructure/repositories/ClickAnalyticsRepository';
import GetTopicAnalyticsUseCase from '@/use_cases/GetTopicAnalytics';

const route = Router();
const tokenService = new TokenService();
const validatorService = new ValidatorService();
const nanoIdService = new NanoIdService();
const geoLocationService = new GeolocationService();
const cacheService = new CacheService();

const urlRepository = new UrlRepository();
const userRepository = new UserRepository();
const clickAnalyticsRepository = new ClickAnalyticsRepository();

const createUrlUseCase = new CreateUrlUseCase(
    validatorService,
    userRepository,
    urlRepository,
    nanoIdService,
    cacheService
);
const redirectUseCase = new RedirectUseCase(
    urlRepository,
    clickAnalyticsRepository,
    geoLocationService,
    cacheService
);
const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(
    urlRepository,
    clickAnalyticsRepository,
    cacheService
);
const getTopicAnalyticsUseCase = new GetTopicAnalyticsUseCase(
    urlRepository,
    clickAnalyticsRepository,
    cacheService
);

const limiterMiddleware = new RateLimiterMiddleware(111);
const limiter = limiterMiddleware.exec.bind(limiterMiddleware);
const authMiddleware = new AuthMiddleware(tokenService);
const urlController = new UrlController(
    createUrlUseCase,
    redirectUseCase,
    getUrlAnalyticsUseCase,
    getTopicAnalyticsUseCase
);

route.use(authMiddleware.exec);

route.get("/analytics/topic/:topic", urlController.getTopicAnalytics.bind(urlController));
route.get("/shorten/:alias", urlController.handleRedirect.bind(urlController));
route.get("/analytics/:alias", urlController.getUrlAnalytics.bind(urlController));
route.post("/shorten", limiter, urlController.createUrl.bind(urlController));

export default route;