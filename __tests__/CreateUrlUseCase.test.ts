import CreateUrlUseCase from "@/use_cases/CreateUrlUseCase";
import { ConflictError, AuthenticationError } from "@/domain/entities/CustomErrors";
import mockValidatorService from "./__mocks__/services/validatorService.mock";
import mockUrlRepository from "./__mocks__/repositories/urlRepository.mock";
import { CLIENT_URL } from "./__mocks__/config/env.mock";
import mockUserRepository from "./__mocks__/repositories/userRepository.mock";
import mockNanoIdService from "./__mocks__/services/nanoIdService.mock";
import mockUrl from "./__mocks__/entities/url.mock";
import mockUser from "./__mocks__/entities/user.mock";

jest.mock("./__mocks__/services/validatorService.mock");
jest.mock("./__mocks__/repositories/urlRepository.mock");
jest.mock("./__mocks__/repositories/userRepository.mock");
jest.mock("./__mocks__/services/nanoIdService.mock");

const createUrlUseCase = new CreateUrlUseCase(
    mockValidatorService,
    mockUserRepository,
    mockUrlRepository,
    mockNanoIdService
);

describe("CreateUrlUseCase", () => {
    const nanoId = "34343232";
    const shortUrl = `${CLIENT_URL}/l/${nanoId}`;
    const { longUrl, topic, customAlias, userId } = mockUrl;

    beforeEach(() => {
        jest.clearAllMocks();
        mockValidatorService.validateRequiredFields.mockReturnValue(undefined);
        mockValidatorService.validateUrl.mockReturnValue(true);
        mockValidatorService.validateString.mockReturnValue(true);
    });

    it("should create a new short url for a longUrl without alias", async () => {
        const expectedDate = new Date().toISOString();
        const expectedUrl = {
            ...mockUrl,
            shortUrl,
            createdAt: expectedDate,
            lastAccessed: expectedDate,
        };

        mockNanoIdService.generateId.mockReturnValue(nanoId);
        mockUserRepository.findById.mockResolvedValue(mockUser);
        mockUrlRepository.create.mockResolvedValue(expectedUrl);

        const res = await createUrlUseCase.exec(userId!, longUrl!, topic!);

        expect(mockNanoIdService.generateId).toHaveBeenCalledWith(8);
        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        expect(mockUrlRepository.create).toHaveBeenCalledWith({
            userId,
            longUrl,
            shortUrl,
            topic,
            clicks: 0,
            lastAccessed: expect.any(Date),
            createdAt: expect.any(Date),
            customAlias: nanoId,
        });

        expect(res).toEqual(expectedUrl);
    });

    it("should create a short url with a custom alias", async () => {
        const cleanedAlias = customAlias!.trim().replace(/\s+/g, "_");
        const aliasUrl = `${CLIENT_URL}/l/${cleanedAlias}`;
        const expectedDate = new Date().toISOString();
        const expectedUrl = {
            ...mockUrl,
            shortUrl: aliasUrl,
            createdAt: expectedDate,
            lastAccessed: expectedDate,
        };

        mockUserRepository.findById.mockResolvedValue(mockUser);
        mockUrlRepository.findByShortUrl.mockResolvedValue(null);
        mockUrlRepository.create.mockResolvedValue(expectedUrl);

        const res = await createUrlUseCase.exec(userId!, longUrl!, topic!, customAlias!);

        expect(mockValidatorService.validateString).toHaveBeenCalledWith(customAlias, "customAlias");
        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        expect(mockUrlRepository.findByShortUrl).toHaveBeenCalledWith(aliasUrl);
        expect(mockUrlRepository.create).toHaveBeenCalledWith({
            userId,
            longUrl,
            shortUrl: aliasUrl,
            topic,
            clicks: 0,
            lastAccessed: expect.any(Date),
            createdAt: expect.any(Date),
            customAlias: cleanedAlias,
        });
        expect(res).toEqual(expectedUrl);
    });

    it("should throw ConflictError when custom alias already exists", async () => {
        const cleanedAlias = customAlias!.trim().replace(/\s+/g, "_");
        const aliasUrl = `${CLIENT_URL}/l/${cleanedAlias}`;

        mockUserRepository.findById.mockResolvedValue(mockUser);
        mockUrlRepository.findByShortUrl.mockResolvedValue({ ...mockUrl, shortUrl: aliasUrl });

        await expect(createUrlUseCase.exec(userId!, longUrl!, topic!, customAlias!)).rejects.toThrow(
            new ConflictError("Custom alias already exists. Please choose another.")
        );

        expect(mockValidatorService.validateString).toHaveBeenCalledWith(customAlias, "customAlias");
        expect(mockUrlRepository.findByShortUrl).toHaveBeenCalledWith(aliasUrl);
    });

    it("should throw AuthenticationError if user does not exist", async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(createUrlUseCase.exec(userId!, longUrl!, topic!)).rejects.toThrow(
            new AuthenticationError("Invalid user Token provided")
        );

        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it("should validate inputs before creating a short url", async () => {
        mockUserRepository.findById.mockResolvedValue(mockUser);
        mockNanoIdService.generateId.mockReturnValue(nanoId);
        mockUrlRepository.create.mockResolvedValue({
            ...mockUrl,
            shortUrl: `${CLIENT_URL}/l/${nanoId}`
        });

        await createUrlUseCase.exec(userId!, longUrl!, topic!);

        expect(mockValidatorService.validateRequiredFields).toHaveBeenCalledWith({
            userId,
            longUrl,
        });
        expect(mockValidatorService.validateUrl).toHaveBeenCalledWith(longUrl);
        expect(mockValidatorService.validateString).toHaveBeenCalledWith(topic, "topic");
    });
});