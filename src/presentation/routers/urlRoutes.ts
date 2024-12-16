import { Router } from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import TokenService from '@/infrastructure/service/TokenService';
import CreateUrlUseCase from '@/use_cases/CreateUrlUseCase';
import ValidatorService from '@/infrastructure/service/ValidatorService';
import UrlRepository from '@/infrastructure/repositories/UrlRepository';
import UserRepository from '@/infrastructure/repositories/UserRepository';
import ClickAnalyticsRepository from '@/infrastructure/repositories/ClickAnalyticsRepository';
import UrlController from '../controllers/UrlController';

const route = Router();

const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(tokenService);
const validatorService = new ValidatorService();
const urlRepository = new UrlRepository();
const userRepository = new UserRepository();
const clickAnalyticsRepository = new ClickAnalyticsRepository();
const createUrlUseCase = new CreateUrlUseCase(
    validatorService,
    userRepository,
    urlRepository,
    clickAnalyticsRepository
);
const urlController = new UrlController(createUrlUseCase);

route.use(authMiddleware.exec.bind(authMiddleware));

route.post("/shorten", urlController.createUrl.bind(urlController));

export default route;