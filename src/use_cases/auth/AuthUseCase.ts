import IUserRepository from "@/domain/interface/repositories/IUserRepository";
import ITokenService from "@/domain/interface/services/ITokenService";
import IValidatorService from "@/domain/interface/services/IValidatorService";
import { AuthenticationError } from "@/domain/entities/CustomErrors";

export default class AuthUseCase {
    constructor(
        private useRepository: IUserRepository,
        private validatorService: IValidatorService,
        private tokenService: ITokenService
    ) { };

    async exec(email: string, name: string): Promise<{ accessToken: string; refreshToken: string; }> {
        this.validatorService.validateRequiredFields({ email, name });
        this.validatorService.validateEmail(email);

        let user = await this.useRepository.findByEmail(email);
        if (!user) {
            
            user = await this.useRepository.create({ email, name });
        }

        const accessToken = this.tokenService.createAccessToken(email, user._id!);
        const refreshToken = this.tokenService.createRefreshToken(email, user._id!);

        await this.useRepository.update(user._id!, {
            token: refreshToken
        });

        return { accessToken, refreshToken };
    }

    async refreshAccessToken(token: string): Promise<{ accessToken: string; }> {
        const { id } = this.tokenService.verifyRefreshToken(token);

        const user = await this.useRepository.findById(id);

        if (!user) {
            throw new AuthenticationError();
        }

        const accessToken = this.tokenService.createAccessToken(user.email!, user._id!);

        return { accessToken };
    }

}