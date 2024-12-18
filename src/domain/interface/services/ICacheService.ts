import IClickAnalytics from "@/domain/entities/IClickAnalytics";
import IUrl from "@/domain/entities/IUrl";
import { GeoLocationResponse } from "./IGeolocationService";
import { OverallAnalyticsResponse, TopicAnalytics } from "@/types";

export default interface ICacheService {
    cacheUrl(url: IUrl): Promise<void>;
    getCachedUrl(shortUrl: string): Promise<IUrl | null>;
    invalidateUrlCache(shortUrl: string): Promise<void>;
    cacheUrlAnalytics(shortUrl: string, analytics: IClickAnalytics[]): Promise<void>;
    getCachedUrlAnalytics(shortUrl: string): Promise<IClickAnalytics[] | null>;
    cacheGeoLocation(geoLocation: GeoLocationResponse): Promise<void>;
    getCachedGeoLocation(ip: string): Promise<GeoLocationResponse | null>;
    cacheTopicAnalytics(analytics: TopicAnalytics): Promise<void>;
    getCachedTopicAnalytics(topic: string): Promise<TopicAnalytics | null>;
    cacheOverallAnalytics(userId:string,analytics:OverallAnalyticsResponse):Promise<void>;
    getCachedOverallAnalytics(userId:string):Promise<OverallAnalyticsResponse|null>;
}