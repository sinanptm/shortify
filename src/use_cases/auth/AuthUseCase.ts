import IUserRepository from "@/domain/interface/repositories/IUserRepository";
import ITokenService from "@/domain/interface/services/ITokenService";
import { AuthenticationError } from "@/domain/entities/CustomErrors";

interface GoogleUser {
    id: string;
    email: string;
    name: string;
}

export default class AuthUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly tokenService: ITokenService
    ) {}

    async authenticateGoogleUser(googleUser: GoogleUser): Promise<{ 
        accessToken: string; 
        refreshToken: string; 
    }> {
        // Check if user exists by Google ID
        console.log(googleUser);
        let user = await this.userRepository.findByGoogleId(googleUser.id);

        // If not, create a new user
        if (!user) {
            user = await this.userRepository.create({
                email: googleUser.email,
                name: googleUser.name,
                googleId: googleUser.id
            });
        }

        // Generate tokens
        const accessToken = this.tokenService.createAccessToken(
            user.email!, 
            user._id!
        );
        const refreshToken = this.tokenService.createRefreshToken(
            user.email!, 
            user._id!
        );

        // Update user with new refresh token
        await this.userRepository.update(user._id!, {
            token: refreshToken
        });

        return { accessToken, refreshToken };
    }

    async refreshAccessToken(token: string): Promise<{ accessToken: string }> {
        // Verify the refresh token
        const { id } = this.tokenService.verifyRefreshToken(token);

        // Find the user
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AuthenticationError();
        }

        // Ensure the provided token matches the stored token
        if (user.token !== token) {
            throw new AuthenticationError();
        }

        // Generate a new access token
        const accessToken = this.tokenService.createAccessToken(
            user.email!, 
            user._id!
        );

        return { accessToken };
    }
}