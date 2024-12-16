import AuthUseCase from "../src/use_cases/AuthUseCase";
import { mockUserRepository } from "./mock/repositories.mock";
import { mockValidatorService, mockTokenService } from './mock/services.mock';
import { user } from './mock/entities';

const authUseCase = new AuthUseCase(
    mockUserRepository,
    mockValidatorService,
    mockTokenService
);

describe("AuthUseCase", () => {
    const accessToken = "mockAccessToken";
    const { _id, email, name, token } = user;

    beforeEach(() => jest.clearAllMocks());

    it("should validate inputs and create tokens for a new user", async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockResolvedValue({ _id, email, name });
        mockTokenService.createAccessToken.mockReturnValue(accessToken);
        mockTokenService.createRefreshToken.mockReturnValue(token!);

        const result = await authUseCase.exec(email!, name!);

        expect(mockValidatorService.validateEmail).toHaveBeenCalledWith(email);
        expect(mockValidatorService.validateString).toHaveBeenCalledWith(name);
        expect(mockUserRepository.create).toHaveBeenCalledWith({ email, name });
        expect(result).toEqual({ accessToken, refreshToken: token });
    });

    it("should return tokens for an existing user", async () => {
        mockUserRepository.findByEmail.mockResolvedValue({ _id, email, name });
        mockTokenService.createAccessToken.mockReturnValue(accessToken);
        mockTokenService.createRefreshToken.mockReturnValue(token!);

        const result = await authUseCase.exec(email!, name!);

        expect(mockUserRepository.create).not.toHaveBeenCalled();
        expect(mockTokenService.createAccessToken).toHaveBeenCalledWith(email, _id);
        expect(result).toEqual({ accessToken, refreshToken: token });
    });

    it("should throw error if email validation fails", async () => {
        mockValidatorService.validateEmail.mockImplementation(() => {
            throw new Error("Invalid email");
        });

        await expect(authUseCase.exec("invalid-email", name!)).rejects.toThrow("Invalid email");
    });
});
