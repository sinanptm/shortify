import { CLIENT_URL } from "@/config/env";
import { AuthenticationError, ConflictError } from "@/domain/entities/CustomErrors";
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import IUserRepository from "@/domain/interface/repositories/IUserRepository";
import INanoIdService from "@/domain/interface/services/INanoIdService";
import IValidatorService from "@/domain/interface/services/IValidatorService";

export default class CreateUrlUseCase {
    constructor(
        private validatorService: IValidatorService,
        private userRepository: IUserRepository,
        private urlRepository: IUrlRepository,
        private nanoIdService: INanoIdService
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
        });

        return url;
    }

    private async generateUniqueShortUrl(customAlias?: string): Promise<string> {
        if (customAlias) {
            this.validatorService.validateString(customAlias,"customAlias");

            customAlias = this.cleanAlias(customAlias);

            const existingAlias = await this.urlRepository.findByShortUrl(this.generateUrl(customAlias));

            if (existingAlias) {
                throw new ConflictError("Custom alias already exists. Please choose another.");
            }
            return customAlias;
        }

        let shortUrl: string;
        while (true) {
            shortUrl = this.nanoIdService.generateId(8);
            const existingShortUrl = await this.urlRepository.findByShortUrl(this.generateUrl(shortUrl));
            if (!existingShortUrl) break;
        }
        return shortUrl.trim();
    }

    private generateUrl(identifier: string): string {
        return `${CLIENT_URL}/l/${identifier}`;
    }

    private cleanAlias(alias: string): string {
        return alias.trim().replace(/\s+/g, '_');  
    }

    private validateInputs(userId: string, longUrl: string, topic: string) {
        this.validatorService.validateRequiredFields({ userId, topic, longUrl });
        this.validatorService.validateUrl(longUrl);
        this.validatorService.validateString(topic,'topic')
    }

    private async ensureUserExists(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AuthenticationError("Invalid user Token provided");
        }
    }

}
