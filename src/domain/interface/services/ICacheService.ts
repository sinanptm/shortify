export enum CachePrefixes {
    UrlCache = 'url:',
    AnalyticsCache = 'analytics:',
    GeoLocationCache = 'geo:',
    TopicAnalytics = 'topic:',
    OverallAnalytics = 'overall:',
}
export enum CacheDuration {
    ThirtySeconds = 30,    
    FiveMinutes = 300,     
    OneHour = 3600,
    TwoHours = 7200,
    OneDay = 86400,
    TwoDays = 172800,
}


export default interface ICacheService {
    setCache<T>(prefix: CachePrefixes, key: string, value: T, expTime?: CacheDuration): Promise<void>;
    getCache<T>(prefix: CachePrefixes, key: string): Promise<T | null>;
    deleteCache(prefix: CachePrefixes, key: string): Promise<void>;
    clearCacheByPrefix(prefix: CachePrefixes): Promise<void>;
}