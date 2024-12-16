import IValidatorService from "../../src/domain/interface/services/IValidatorService";
import ITokenService from "../../src/domain/interface/services/ITokenService";

export const mockTokenService: jest.Mocked<ITokenService> = {
    createAccessToken: jest.fn(),
    createRefreshToken: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn()
};



export const mockValidatorService: jest.Mocked<IValidatorService> = {
    validateEmail: jest.fn(),
    validateString: jest.fn(),
    validateUrl: jest.fn(), 
    validateLength:jest.fn(),
    validateRequiredFields:jest.fn()
};

