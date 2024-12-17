import IClickAnalytics from "@/domain/entities/IClickAnalytics";
import IClickAnalyticsRepository from "@/domain/interface/repositories/IClickAnalyticsRepository";
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import { IUrlWithClickCount } from "@/domain/entities/IUrl";
import ICacheService from "@/domain/interface/services/ICacheService";
import { AggregatedClickData, TopicAnalytics } from "@/types";
import { NotFoundError } from "@/domain/entities/CustomErrors";

export default class GetTopicAnalyticsUseCase {
    constructor(
        private readonly urlRepository: IUrlRepository,
        private readonly clickAnalyticsRepository: IClickAnalyticsRepository,
        private readonly cacheService: ICacheService
    ) { }

    async exec(topic: string): Promise<TopicAnalytics> {
        const cachedAnalytics = await this.cacheService.getCachedTopicAnalytics(topic);
        if (cachedAnalytics) return cachedAnalytics;

        const urlsByTopic = await this.urlRepository.findByTopic(topic);

        if (!urlsByTopic || urlsByTopic.length < 1) {
            throw new NotFoundError("Topic Not Found");
        }

        const { totalClicks, uniqueClicks, urls, urlIds } = this.aggregateUrlData(urlsByTopic);

        const clicksByDate = await this.getClicksByDate(urlIds);

        const analytics: TopicAnalytics = {
            topic,
            urls,
            uniqueClicks,
            totalClicks,
            clicksByDate,
        };

        await this.cacheService.cacheTopicAnalytics(analytics);

        return analytics;
    }

    private aggregateUrlData(urlsByTopic: IUrlWithClickCount[]) {
        const urlIds: string[] = [];
        let totalClicks = 0;
        let uniqueClicks = 0;

        const urls = urlsByTopic.map(({ _id, totalClicks: urlTotal, uniqueClicks: urlUnique, shortUrl }) => {
            urlIds.push(_id!);
            totalClicks += urlTotal;
            uniqueClicks += urlUnique;

            return {
                totalClicks: urlTotal,
                uniqueClicks: urlUnique,
                shortUrl: shortUrl!,
            };
        });

        return { urls, urlIds, totalClicks, uniqueClicks };
    }

    private async getClicksByDate(urlIds: string[]): Promise<AggregatedClickData[]> {
        const clickData: IClickAnalytics[] = await this.clickAnalyticsRepository.findByUrlIds(urlIds);
        const recentData = this.filterRecentClicks(clickData);

        return this.aggregateClicksByDate(recentData);
    }

    private filterRecentClicks(data: IClickAnalytics[]): IClickAnalytics[] {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); ``;

        return data.filter((click) => new Date(click.timestamp!) >= sevenDaysAgo);
    }

    private aggregateClicksByDate(data: IClickAnalytics[]): AggregatedClickData[] {
        return data.reduce<AggregatedClickData[]>((acc, click) => {
            const date = new Date(click.timestamp!).toISOString().split("T")[0];

            const existingDateEntry = acc.find((item) => item.date === date);
            if (existingDateEntry) {
                existingDateEntry.count += 1;
            } else {
                acc.push({ date, count: 1 });
            }

            return acc;
        }, []);
    }
}
