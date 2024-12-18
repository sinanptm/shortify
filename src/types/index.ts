export enum StatusCode {
    Success = 200,
    Created = 201,
    Accepted = 202,
    NoContent = 204,
    Redirect = 301,
    BadRequest = 400,
    Unauthorized = 401,
    PaymentError = 402,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    UnprocessableEntity = 422,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    RateLimitExceeded = 429
}

export type AggregatedClickData = {
    date: string;
    count: number;
    shortUrl?: string;
};


export type TopicAnalytics = {
    topic:string,
    urls:{
        totalClicks:number,
        uniqueClicks:number,
        shortUrl:string
    }[],
    uniqueClicks:number,
    totalClicks:number,
    clicksByDate:AggregatedClickData[]
}


export type OverallAnalyticsResponse = {
  totalUrls: number;
  totalClicks: number;
  uniqueClicks: number;
  clicksByDate: AggregatedClickData[];
  osType: { osName: string; uniqueClicks: number; uniqueUsers: number }[];
  deviceType: { deviceName: string; uniqueClicks: number; uniqueUsers: number }[];
};