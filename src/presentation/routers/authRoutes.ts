import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import AuthUseCase from '@/use_cases/AuthUseCase';
import UserRepository from '@/infrastructure/repositories/UserRepository';
import ValidatorService from '@/infrastructure/service/ValidatorService';
import TokenService from '@/infrastructure/service/TokenService';

const route = Router();

const useRepository = new UserRepository();
const validatorService = new ValidatorService();
const tokenService = new TokenService();
const authUseCase = new AuthUseCase(useRepository, validatorService, tokenService);

const authController = new AuthController(authUseCase);

route.post("/auth", authController.exec.bind(authController));
route.put("/refresh-token",authController.refreshAccessToken.bind(authController));
route.delete("/logout",authController.logout.bind(authController))

export default route;