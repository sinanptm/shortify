import IUserRepository from "../src/domain/interface/repositories/IUserRepository";

export const mockUserRepository: jest.Mocked<IUserRepository> = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),  
} as any;
