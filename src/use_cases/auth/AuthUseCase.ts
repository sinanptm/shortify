import IUserRepository from "@/domain/interface/repositories/IUserRepository";
import ITokenService from "@/domain/interface/services/ITokenService";

interface GoogleUser {
    id: string;
    email: string;
    name: string;
}

export default class AuthUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly tokenService: ITokenService
    ) { }

    async authenticateGoogleUser(googleUser: GoogleUser) {
        let user = await this.userRepository.findByGoogleId(googleUser.id);

        if (!user) {
            user = await this.userRepository.create({
                email: googleUser.email,
                name: googleUser.name,
                googleId: googleUser.id
            });
        }

        const token = this.tokenService.createToken(user.email!, user._id!);

        await this.userRepository.update(user._id!, { token });

        return { token };
    }
}