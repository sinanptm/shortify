import IValidatorService from "@/domain/interface/services/IValidatorService";

const mockValidatorService: jest.Mocked<IValidatorService> = {
    validateEmail: jest.fn(),
    validateString: jest.fn(),
    validateUrl: jest.fn(), 
    validateLength:jest.fn(),
    validateRequiredFields:jest.fn()
};

export default mockValidatorService