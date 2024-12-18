import { CLIENT_URL } from "@/config/env";
import { AuthenticationError, ConflictError } from "@/domain/entities/CustomErrors";
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import IUserRepository from "@/domain/interface/repositories/IUserRepository";
import ICacheService, { CacheDuration, CachePrefixes } from "@/domain/interface/services/ICacheService";
import INanoIdService from "@/domain/interface/services/INanoIdService";
import IValidatorService from "@/domain/interface/services/IValidatorService";

export default class CreateUrlUseCase {
    constructor(
        private readonly validatorService: IValidatorService,
        private readonly userRepository: IUserRepository,
        private readonly urlRepository: IUrlRepository,
        private readonly nanoIdService: INanoIdService,
        private readonly cacheService: ICacheService
    ) { }


    async exec(userId: string, longUrl: string, topic: string, customAlias?: string) {
        this.validateInputs(userId, longUrl, topic);
        await this.ensureUserExists(userId);

        const shortUrl = await this.generateUniqueShortUrl(customAlias);
        const date = new Date();
        const url = await this.urlRepository.create({
            userId,
            longUrl,
            shortUrl: this.generateUrl(shortUrl),
            topic,
            clicks: 0,
            lastAccessed: date,
            createdAt: date,
            customAlias: shortUrl
        });

        await this.cacheService.setCache(CachePrefixes.UrlCache, url.shortUrl!, url, CacheDuration.TwoHours);
        return url;
    }

    private async generateUniqueShortUrl(customAlias?: string): Promise<string> {
        if (customAlias) {
            this.validatorService.validateString(customAlias, "customAlias");

            customAlias = customAlias.trim().replace(/\s+/g, '_');

            const existingAlias = await this.urlRepository.findByShortUrl(this.generateUrl(customAlias));

            if (existingAlias) {
                throw new ConflictError("Custom Alias already exists. Please Choose another.");
            }
            return customAlias;
        }

        const shortUrl = this.nanoIdService.generateId(8);
        return shortUrl.trim();
    }

    private generateUrl(identifier: string): string {
        return `${CLIENT_URL}/l/${identifier}`;
    }

    private validateInputs(userId: string, longUrl: string, topic: string) {
        this.validatorService.validateRequiredFields({ userId, longUrl });
        this.validatorService.validateUrl(longUrl);
        if (topic) {
            this.validatorService.validateString(topic, 'topic');
        }
    }

    private async ensureUserExists(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AuthenticationError("Invalid user Token provided");
        }
    }

}
