import ITokenService from "@/domain/interface/services/ITokenService";

const mockTokenService: jest.Mocked<ITokenService> = {
    createToken: jest.fn(),
    verifyToken: jest.fn()
};

export default mockTokenService;