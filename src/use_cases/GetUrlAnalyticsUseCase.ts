import { CLIENT_URL } from "@/config/env";
import { NotFoundError } from "@/domain/entities/CustomErrors";
import IClickAnalytics from "@/domain/entities/IClickAnalytics";
import IClickAnalyticsRepository from "@/domain/interface/repositories/IClickAnalyticsRepository";
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import ICacheService from "@/domain/interface/services/ICacheService";
import { AggregatedClickData } from "@/types";
import aggregateClicksByDate from "@/utils/aggregateClicksByDate";

export default class GetUrlAnalyticsUseCase {
  constructor(
    private readonly urlRepository: IUrlRepository,
    private readonly clickAnalyticsRepository: IClickAnalyticsRepository,
    private readonly cacheService: ICacheService
  ) { }

  async exec(alias: string) {
    const url = await this.getUrl(alias);
    const [deviceAnalytics, osAnalytics] = await Promise.all([
      this.clickAnalyticsRepository.getDeviceAnalytics(url._id!),
      this.clickAnalyticsRepository.getOsAnalytics(url._id!),
    ]);

    const [totalClicks, uniqueClicks] = await this.getClickAnalytics(
      url._id!,
      `${CLIENT_URL}/l/${alias}`
    );

    const clicksByDate = await this.getClicksByDate(url._id!, url.shortUrl!);

    return {
      totalClicks,
      uniqueClicks,
      clicksByDate,
      osType: osAnalytics,
      deviceType: deviceAnalytics,
    };
  }

  private async getUrl(alias: string) {
    const fullUrl = `${CLIENT_URL}/l/${alias}`;
    let url = await this.cacheService.getCachedUrl(fullUrl);

    if (!url) {
      url = await this.urlRepository.findByCustomAlias(alias);
      if (!url) {
        throw new NotFoundError("URL not found");
      }
    }
    return url;
  }

  private async getClickAnalytics(
    urlId: string,
    shortUrl: string
  ): Promise<[number, number]> {
    const analytics = await this.findAnalytics(shortUrl, urlId);
    const uniqueClicks = await this.clickAnalyticsRepository.getUniqueVisitors(urlId);
    return [analytics.length, uniqueClicks];
  }

  private async findAnalytics(shortUrl: string, urlId: string) {
    let analytics = await this.cacheService.getCachedUrlAnalytics(shortUrl);

    if (!analytics) {
      analytics = await this.clickAnalyticsRepository.findByUrlId(urlId);
      await this.cacheService.cacheUrlAnalytics(shortUrl, analytics);
    }

    return analytics;
  }

  private async getClicksByDate(urlId: string, shortUrl: string): Promise<AggregatedClickData[]> {
    const data: IClickAnalytics[] = await this.findAnalytics(shortUrl, urlId);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentData = data.filter(
      (click) => new Date(click.timestamp!) >= sevenDaysAgo
    );

    return aggregateClicksByDate(recentData);
  }

}
