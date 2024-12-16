import IUrl from "@/domain/entities/IUrl";
import BaseRepository from "./BaseRepository";

export default interface IUrlRepository extends BaseRepository<IUrl> {
    findByLongUrl(url: string): Promise<IUrl | null>;
}