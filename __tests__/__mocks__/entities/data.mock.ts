export const EMPTY_ANALYTICS = {
    totalUrls: 0,
    totalClicks: 0,
    uniqueClicks: 0,
    clicksByDate: [],
    osType: [],
    deviceType: []
};

export const mockUrls = [
    { _id: "url1", shortUrl: "short1" },
    { _id: "url2", shortUrl: "short2" }
];

export const mockClickData = [
    { timestamp: "2024-12-10T00:00:00.000Z", urlId: "url1", ipAddress: "1.1.1.1", deviceType: "Desktop", osType: "Windows" },
    { timestamp: "2024-12-10T00:00:00.000Z", urlId: "url1", ipAddress: "1.1.1.2", deviceType: "Desktop", osType: "Windows" },
    { timestamp: "2024-12-11T00:00:00.000Z", urlId: "url2", ipAddress: "1.1.1.3", deviceType: "Mobile", osType: "MacOS" },
    { timestamp: "2024-12-11T00:00:00.000Z", urlId: "url2", ipAddress: "1.1.1.4", deviceType: "Mobile", osType: "MacOS" }
];

export const mockAggregatedClicksByDate = [
    { date: "2024-12-10", count: 2 },
    { date: "2024-12-11", count: 2 }
];

export const mockAnalytics = {
    totalUrls: 2,
    totalClicks: 4,
    uniqueClicks: 4,
    clicksByDate: mockAggregatedClicksByDate,
    osType: [
        { osName: "Windows", uniqueClicks: 2, uniqueUsers: 2 },
        { osName: "MacOS", uniqueClicks: 2, uniqueUsers: 2 }
    ],
    deviceType: [
        { deviceName: "Desktop", uniqueClicks: 2, uniqueUsers: 2 },
        { deviceName: "Mobile", uniqueClicks: 2, uniqueUsers: 2 }
    ]
};

export const cachedAnalytics = {
    totalUrls: 2,
    totalClicks: 4,
    uniqueClicks: 4,
    clicksByDate: mockAggregatedClicksByDate,
    osType: [
        { osName: "Windows", uniqueClicks: 2, uniqueUsers: 2 },
        { osName: "MacOS", uniqueClicks: 2, uniqueUsers: 2 }
    ],
    deviceType: [
        { deviceName: "Desktop", uniqueClicks: 2, uniqueUsers: 2 },
        { deviceName: "Mobile", uniqueClicks: 2, uniqueUsers: 2 }
    ]
};