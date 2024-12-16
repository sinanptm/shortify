export default interface ITopicAnalytics {
    readonly _id: string;                      
    readonly topic: string;                  
    readonly totalClicks: number;              
    readonly uniqueClicks: number;             
    readonly clicksByDate: Array<{             
        date: string;                         
        clickCount: number;                   
    }>;
    readonly urls: Array<{                     
        shortUrl: string;                      
        totalClicks: number;                 
        uniqueClicks: number;                  
    }>;
}
