import IUrl from "@/domain/entities/IUrl";
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import Url from "../models/Url";
import { Model } from "mongoose";

export default class UrlRepository implements IUrlRepository {
    private urlModel: Model<IUrl>;

    constructor() {
        this.urlModel = Url;
    }

    async create(entity: IUrl): Promise<IUrl> {
        return await this.urlModel.create(entity);
    }

    async findById(id: string): Promise<IUrl | null> {
        return await this.urlModel.findById(id).lean();
    }

    async update(id: string, entity: IUrl): Promise<IUrl | null> {
        return await this.urlModel.findByIdAndUpdate(
            id,
            entity,
            { new: true }
        ).lean();
    }

    async delete(id: string): Promise<void> {
        await this.urlModel.findByIdAndDelete(id);
    }

    async findByLongUrl(url: string): Promise<IUrl | null> {
        return await this.urlModel.findOne({ longUrl: url }).lean();
    }

    async findByShortUrl(shortUrl: string): Promise<IUrl | null> {
        return await this.urlModel.findOne({ shortUrl }).lean();
    }

    async findByCustomAlias(alias: string): Promise<IUrl | null> {
        return await this.urlModel.findOne({ customAlias: alias }).lean();
    }

    async findByUserId(userId: string): Promise<IUrl[]> {
        return await this.urlModel.find({ userId }).lean();
    }

    async findByTopic(topic: string, userId: string): Promise<IUrl[]> {
        return await this.urlModel.find({ topic, userId }).lean();
    }

    async incrementClicks(id: string): Promise<void> {
        await this.urlModel.findByIdAndUpdate(id, {
            $inc: { clicks: 1 },
            lastAccessed: new Date()
        });
    }

    async findTopUrls(userId: string, limit: number): Promise<IUrl[]> {
        return await this.urlModel
            .find({ userId })
            .sort({ clicks: -1 })
            .limit(limit)
            .lean();
    }
}