import AuthUseCase from "@/use_cases/auth/AuthUseCase";
import mockUser  from "./__mocks__/entities/user.mock";
import mockUserRepository  from "./__mocks__/repositories/userRepository.mock";
import mockTokenService  from "./__mocks__/services/tokenService.mock";
import mockValidatorService  from './__mocks__/services/validatorService.mock';

jest.mock("./__mocks__/repositories/userRepository.mock.ts");
jest.mock("./__mocks__/services/tokenService.mock");
jest.mock("./__mocks__/services/validatorService.mock");

const authUseCase = new AuthUseCase(
    mockUserRepository,
    mockValidatorService,
    mockTokenService
);

describe("AuthUseCase", () => {
    const accessToken = "mockAccessToken";
    const { _id, email, name, token } = mockUser;

    beforeEach(() => jest.clearAllMocks());

    it("should create tokens for a new user", async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockResolvedValue({ _id, email, name });
        mockTokenService.createAccessToken.mockReturnValue(accessToken);
        mockTokenService.createRefreshToken.mockReturnValue(token!);

        const result = await authUseCase.exec(email!, name!);

        expect(mockUserRepository.create).toHaveBeenCalledWith({ email, name });
        expect(mockTokenService.createAccessToken).toHaveBeenCalledWith(email, _id);
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

    it("should create new tokens and return them", async () => {
        mockTokenService.verifyRefreshToken.mockReturnValue({ email: email!, id: _id! });
        mockUserRepository.findById.mockResolvedValue({ email, _id });
        mockTokenService.createAccessToken.mockReturnValue(accessToken);
        mockTokenService.createRefreshToken.mockReturnValue(token!);
    
        const res = await authUseCase.refreshAccessToken(token!);
    
        expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(token!); 
        expect(mockUserRepository.findById).toHaveBeenCalledWith(_id);
        expect(mockTokenService.createAccessToken).toHaveBeenCalledWith(email, _id); 
        expect(res).toEqual({ accessToken }); 
    });
    
});
