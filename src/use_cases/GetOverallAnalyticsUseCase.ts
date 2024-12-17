import IClickAnalyticsRepository from "@/domain/interface/repositories/IClickAnalyticsRepository";
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import ICacheService from "@/domain/interface/services/ICacheService";

export default class GetOverallAnalyticsUseCase {
    constructor(
        private urlRepository: IUrlRepository,
        private cacheService: ICacheService,
        private clickAnalyticsRepository:IClickAnalyticsRepository
    ){};
    
    async exec(userId:string){

    }
}