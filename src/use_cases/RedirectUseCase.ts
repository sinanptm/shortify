import { Request } from 'express';
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import IClickAnalyticsRepository from "@/domain/interface/repositories/IClickAnalyticsRepository";
import IGeolocationService from "@/domain/interface/services/IGeolocationService";
import { NotFoundError } from "@/domain/entities/CustomErrors";
import IUrl from '@/domain/entities/IUrl';
import IClickAnalytics from '@/domain/entities/IClickAnalytics';

export default class RedirectUseCase {
    constructor(
        private urlRepository: IUrlRepository,
        private clickAnalyticsRepository: IClickAnalyticsRepository,
        private geolocationService: IGeolocationService
    ) { }

    async exec(alias: string, request: Request): Promise<string> {
        const url = await this.findUrlByAlias(alias);

        await this.urlRepository.incrementClicks(url._id!);

        const analyticsData = await this.extractAnalyticsData(url, request);

        await this.clickAnalyticsRepository.create(analyticsData);

        await this.urlRepository.update(url._id!, { ...url, clicks: url.clicks! + 1 });

        return url.longUrl!;
    }

    private async findUrlByAlias(alias: string): Promise<IUrl> {
        const fullUrl = `${process.env.CLIENT_URL}/l/${alias}`;
        const url = await this.urlRepository.findByShortUrl(fullUrl);

        if (!url) {
            throw new NotFoundError('URL not found');
        }

        return url;
    }

    private async extractAnalyticsData(url: IUrl, request: Request): Promise<IClickAnalytics> {
        const ipAddress = this.extractIpAddress(request);

        const geoLocation = await this.geolocationService.locate(ipAddress);

        return {
            urlId: url._id,
            userId: url.userId,
            ipAddress,
            userAgent: request.get('User-Agent') || 'Unknown',
            deviceType: this.detectDeviceType(request),
            osType: this.detectOsType(request),
            browser: this.detectBrowserType(request),
            country: geoLocation?.country || 'Unknown',
            timestamp: new Date(),
        };
    }

    private extractIpAddress(request: Request): string {
        return (
            request.ip ||
            (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
            request.socket.remoteAddress ||
            '0.0.0.0'
        );
    }

    private detectDeviceType(request: Request): string {
        const userAgent = request.get('User-Agent') || '';
        if (/mobile/i.test(userAgent)) return 'Mobile';
        if (/tablet/i.test(userAgent)) return 'Tablet';
        return 'Desktop';
    }

    private detectOsType(request: Request): string {
        const userAgent = request.get('User-Agent') || '';
        if (/Windows/i.test(userAgent)) return 'Windows';
        if (/Macintosh/i.test(userAgent)) return 'macOS';
        if (/Linux/i.test(userAgent)) return 'Linux';
        if (/iOS/i.test(userAgent)) return 'iOS';
        if (/Android/i.test(userAgent)) return 'Android';
        return 'Unknown';
    }

    private detectBrowserType(request: Request): string {
        const userAgent = request.get('User-Agent') || '';
        if (/Chrome/i.test(userAgent)) return 'Chrome';
        if (/Firefox/i.test(userAgent)) return 'Firefox';
        if (/Safari/i.test(userAgent)) return 'Safari';
        if (/Edge/i.test(userAgent)) return 'Edge';
        if (/MSIE/i.test(userAgent) || /Trident/i.test(userAgent)) return 'Internet Explorer';
        return 'Unknown';
    }
}
