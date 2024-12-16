import IUserRepository from "@/domain/interface/repositories/IUserRepository";
import IValidatorService from "@/domain/interface/services/IValidatorService";

export default class CreateUrlUseCase {
    constructor(
        private validatorService:IValidatorService,
        private userRepository:IUserRepository
    ){};

    exec(){

    }
}