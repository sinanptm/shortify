import { Router } from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import TokenService from '@/infrastructure/service/TokenService';
import CreateUrlUseCase from '@/use_cases/CreateUrlUseCase';
import ValidatorService from '@/infrastructure/service/ValidatorService';
import UrlRepository from '@/infrastructure/repositories/UrlRepository';
import UserRepository from '@/infrastructure/repositories/UserRepository';
import ClickAnalyticsRepository from '@/infrastructure/repositories/ClickAnalyticsRepository';
import UrlController from '../controllers/UrlController';
import NanoIdService from '@/infrastructure/service/NanoIdService';
import RateLimiterMiddleware from '../middlewares/RateLimiterMiddleware';
import RedirectUseCase from '@/use_cases/RedirectUseCase';
import GeolocationService from '@/infrastructure/service/GeoLocationService';
import { CacheService } from '@/infrastructure/service/CacheService';

const route = Router();
const tokenService = new TokenService();
const validatorService = new ValidatorService();
const nanoIdService = new NanoIdService();
const geoLocationService = new GeolocationService();
const cacheService = new CacheService()

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

const limiterMiddleware = new RateLimiterMiddleware(111);
const limiter = limiterMiddleware.exec.bind(limiterMiddleware);
const authMiddleware = new AuthMiddleware(tokenService);
const urlController = new UrlController(createUrlUseCase, redirectUseCase);

route.use(authMiddleware.exec);

route.post("/shorten", limiter, urlController.createUrl.bind(urlController))
route.get("/shorten/:alias",urlController.handleRedirect.bind(urlController));

export default route;