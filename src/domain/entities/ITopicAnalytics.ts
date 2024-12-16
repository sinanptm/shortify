export default interface ITopicAnalytics {
    readonly _id: string;                       // Unique identifier for the topic
    readonly topic: string;                     // The topic or category (e.g., 'acquisition')
    readonly totalClicks: number;               // Total number of clicks across URLs in this topic
    readonly uniqueClicks: number;              // Unique number of users who clicked in this topic
    readonly clicksByDate: Array<{              // Clicks by date (for the last 7 days)
        date: string;                           // Date string (ISO format)
        clickCount: number;                     // Click count for that date
    }>;
    readonly urls: Array<{                      // List of short URLs under this topic
        shortUrl: string;                       // The generated short URL
        totalClicks: number;                    // Total clicks for that URL
        uniqueClicks: number;                   // Unique clicks for that URL
    }>;
}
