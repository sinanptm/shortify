import IUrl from "@/domain/entities/IUrl";
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import { IUrlWithClickCount } from "@/domain/entities/IUrl";
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

    async findByTopic(topic: string): Promise<IUrlWithClickCount[]> {
        return await this.urlModel.aggregate([
            {
                $match: { topic: topic }
            },
            {
                $lookup: {
                    from: "clickanalytics",
                    localField: "_id",
                    foreignField: "urlId",
                    as: "clickAnalytics"
                }
            },
            {
                $addFields: {
                    totalClicks: { $size: "$clickAnalytics" },
                    uniqueClicks: {
                        $size: {
                            $setUnion: [
                                "$clickAnalytics.userId",
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    longUrl: 1,
                    shortUrl: 1,
                    customAlias: 1,
                    topic: 1,
                    userId: 1,
                    totalClicks: 1,
                    uniqueClicks: 1,
                    createdAt: 1,
                }
            }
        ]);
    }

    async incrementClicks(id: string): Promise<IUrl | null> {
        return await this.urlModel.findByIdAndUpdate(id, {
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