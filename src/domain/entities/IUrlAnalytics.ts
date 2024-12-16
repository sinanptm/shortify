import IUrl from "./IUrl";

export default interface IUrlAnalytics {
    readonly _id: string;                        
    readonly shortUrlId: IUrl["_id"];                 
    readonly totalClicks: number;                
    readonly uniqueClicks: number;                
    readonly clicksByDate: Array<{      
        date: string;                           
        clickCount: number;                       
    }>;
    readonly osType: Array<{                     
        osName: string;                           
        uniqueClicks: number;   
        uniqueUsers:number;                  
    }>;
    readonly deviceType: Array<{                 
        deviceName: string;                     
        uniqueClicks: number;                    
        uniqueUsers: number;                  
    }>;
}
