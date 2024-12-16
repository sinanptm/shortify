import IUserRepository from "@/domain/interface/repositories/IUserRepository";
import ITokenService from "@/domain/interface/services/ITokenService";
import IValidatorService from "@/domain/interface/services/IValidatorService";

export default class AuthUseCase {
    constructor(
        private useRepository: IUserRepository,
        private validatorService: IValidatorService,
        private tokenService: ITokenService
    ) { };

    async exec(email: string, name: string): Promise<{ accessToken: string; refreshToken: string; }> {
        this.validatorService.validateEmail(email);
        this.validatorService.validateString(name);

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
}