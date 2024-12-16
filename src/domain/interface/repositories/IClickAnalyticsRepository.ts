import IClickAnalytics from "@/domain/entities/IClickAnalytics";
import BaseRepository from "./BaseRepository";

export default interface IClickAnalyticsRepository extends BaseRepository<IClickAnalytics> {
    findByUrlId(urlId: string): Promise<IClickAnalytics[]>;
    findByUserId(userId: string): Promise<IClickAnalytics[]>;
    getUniqueVisitors(urlId: string): Promise<number>;
    getDeviceAnalytics(urlId: string): Promise<any>;
    getOsAnalytics(urlId: string): Promise<any>;
}
