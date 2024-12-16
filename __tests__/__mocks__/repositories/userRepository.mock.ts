import IUserRepository from "@/domain/interface/repositories/IUserRepository";

const mockUserRepository: jest.Mocked<IUserRepository> = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),  
} as any;

export default mockUserRepository