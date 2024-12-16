export default interface IUrlAnalytics {
    readonly _id: string;                        
    readonly shortUrlId: string;                  // Reference to the short URL
    readonly totalClicks: number;                 // Total number of clicks on this URL
    readonly uniqueClicks: number;                // Unique number of users who clicked
    readonly clicksByDate: Array<{                // Number of clicks by date (e.g., recent 7 days)
        date: string;                             // Date string (ISO format)
        clickCount: number;                       // Click count for that date
    }>;
    readonly osType: Array<{                      // Operating system breakdown of clicks
        osName: string;                           // OS name (Windows, macOS, Android, iOS, etc.)
        uniqueClicks: number;                     // Unique clicks from that OS
        uniqueUsers: number;                      // Unique users from that OS
    }>;
    readonly deviceType: Array<{                  // Device type breakdown (mobile, desktop, etc.)
        deviceName: string;                       // Device type (e.g., mobile, desktop)
        uniqueClicks: number;                     // Unique clicks from that device
        uniqueUsers: number;                      // Unique users from that device
    }>;
}
