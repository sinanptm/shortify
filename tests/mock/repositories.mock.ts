import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import IUserRepository from "../../src/domain/interface/repositories/IUserRepository";

export const mockUserRepository: jest.Mocked<IUserRepository> = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),  
} as any;

export const mockUrlRepository: jest.Mocked<IUrlRepository> = {
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
    findByCustomAlias:jest.fn(),
    findByLongUrl:jest.fn(),
    findByShortUrl:jest.fn(),
    findByTopic:jest.fn(),
    findByUserId:jest.fn(),
    findTopUrls:jest.fn(),
    incrementClicks:jest.fn()
}