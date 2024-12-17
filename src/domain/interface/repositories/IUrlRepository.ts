import IUrl from "@/domain/entities/IUrl";
import BaseRepository from "./BaseRepository";

export default interface IUrlRepository extends BaseRepository<IUrl> {
    findByLongUrl(url: string): Promise<IUrl | null>;
    findByShortUrl(shortUrl: string): Promise<IUrl | null>;
    findByCustomAlias(alias: string): Promise<IUrl | null>;
    findByUserId(userId: string): Promise<IUrl[]>;
    findByTopic(topic: string, userId: string): Promise<IUrl[]>;
    incrementClicks(id: string): Promise<IUrl|null>;
    findTopUrls(userId: string, limit: number): Promise<IUrl[]>;
}