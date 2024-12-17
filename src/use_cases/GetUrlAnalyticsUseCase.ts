import IClickAnalyticsRepository from "@/domain/interface/repositories/IClickAnalyticsRepository";
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import ICacheService from "@/domain/interface/services/ICacheService";

export default class GetUrlAnalyticsUseCase {
  constructor(
    private readonly urlRepository:IUrlRepository,
    private readonly clickAnalyticsRepository:IClickAnalyticsRepository,
    private readonly cacheService: ICacheService
  ){}

  async  exec(alias:string){
    
  }
}