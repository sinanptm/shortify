export const mockClickData = [
    { timestamp: new Date().toISOString(), urlId: "url1" },
    { timestamp: new Date().toISOString(), urlId: "url1" },
    { timestamp: new Date().toISOString(), urlId: "url2" },
    { timestamp: new Date().toISOString(), urlId: "url2" }
];

export const mockAggregatedClickData = [
    { date: new Date().toISOString().split("T")[0], count: 4 }
];
