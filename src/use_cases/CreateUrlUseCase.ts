import IClickAnalyticsRepository from "@/domain/interface/repositories/IClickAnalyticsRepository";
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import IUserRepository from "@/domain/interface/repositories/IUserRepository";
import IValidatorService from "@/domain/interface/services/IValidatorService";

export default class CreateUrlUseCase {
    constructor(
        private validatorService:IValidatorService,
        private userRepository:IUserRepository,
        private urlRepository:IUrlRepository,
        private clickAnalyticsRepository:IClickAnalyticsRepository
    ){};

    async exec(){

    }
}