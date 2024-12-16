import AuthUseCase from "../src/use_cases/AuthUseCase";
import { mockUserRepository } from "./mock/repositories.mock";
import { mockValidatorService, mockTokenService } from './mock/services.mock';

const authUseCase = new AuthUseCase(
    mockUserRepository,
    mockValidatorService,
    mockTokenService
);

describe("AuthUseCase", () => {
    const email = "test@example.com";
    const name = "John Doe";
    const userId = "user123";
    const accessToken = "mockAccessToken";
    const refreshToken = "mockRefreshToken";

    beforeEach(() => jest.clearAllMocks());

    it("should validate inputs and create tokens for a new user", async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockResolvedValue({ _id: userId, email, name });
        mockTokenService.createAccessToken.mockReturnValue(accessToken);
        mockTokenService.createRefreshToken.mockReturnValue(refreshToken);

        const result = await authUseCase.exec(email, name);

        expect(mockValidatorService.validateEmail).toHaveBeenCalledWith(email);
        expect(mockValidatorService.validateString).toHaveBeenCalledWith(name);
        expect(mockUserRepository.create).toHaveBeenCalledWith({ email, name });
        expect(result).toEqual({ accessToken, refreshToken });
    });

    it("should return tokens for an existing user", async () => {
        mockUserRepository.findByEmail.mockResolvedValue({ _id: userId, email, name });
        mockTokenService.createAccessToken.mockReturnValue(accessToken);
        mockTokenService.createRefreshToken.mockReturnValue(refreshToken);

        const result = await authUseCase.exec(email, name);

        expect(mockUserRepository.create).not.toHaveBeenCalled();
        expect(mockTokenService.createAccessToken).toHaveBeenCalledWith(email, userId);
        expect(result).toEqual({ accessToken, refreshToken });
    });

    it("should throw error if email validation fails", async () => {
        mockValidatorService.validateEmail.mockImplementation(() => {
            throw new Error("Invalid email");
        });

        await expect(authUseCase.exec("invalid-email", name)).rejects.toThrow("Invalid email");
    });
});
