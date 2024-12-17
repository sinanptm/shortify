import IClickAnalytics from "@/domain/entities/IClickAnalytics";
import IUrl from "@/domain/entities/IUrl";
import { GeoLocationResponse } from "./IGeolocationService";

export default interface ICacheService {
    cacheUrl(url: IUrl): Promise<void>;
    getCachedUrl(shortUrl: string): Promise<IUrl | null>;
    invalidateUrlCache(shortUrl: string): Promise<void>;
    cacheAnalytics(shortUrl: string, analytics: IClickAnalytics[]): Promise<void>;
    getCachedAnalytics(shortUrl: string): Promise<IClickAnalytics[] | null>;
    cacheGeoLocation(geoLocation: GeoLocationResponse): Promise<void>;
    getCachedGeoLocation(ip: string): Promise<GeoLocationResponse | null>;
}