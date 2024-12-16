import IClickAnalytics from "@/domain/entities/IClickAnalytics";
import IClickAnalyticsRepository from "@/domain/interface/repositories/IClickAnalyticsRepository";
import ClickAnalytics from "../models/ClickAnalytics";
import { Model } from "mongoose";

export default class ClickAnalyticsRepository implements IClickAnalyticsRepository {
    private analyticsModel: Model<IClickAnalytics>;

    constructor() {
        this.analyticsModel = ClickAnalytics;
    }

    async create(analytics: IClickAnalytics): Promise<IClickAnalytics> {
        return await this.analyticsModel.create(analytics);
    }

    async findById(id: string): Promise<IClickAnalytics | null> {
        return await this.analyticsModel.findById(id).lean();
    }

    async update(id: string, analytics: IClickAnalytics): Promise<IClickAnalytics | null> {
        return await this.analyticsModel.findByIdAndUpdate(
            id,
            analytics,
            { new: true }
        ).lean();
    }

    async delete(id: string): Promise<void> {
        await this.analyticsModel.findByIdAndDelete(id);
    }

    async findByUrlId(urlId: string): Promise<IClickAnalytics[]> {
        return await this.analyticsModel.find({ urlId }).lean();
    }

    async findByUserId(userId: string): Promise<IClickAnalytics[]> {
        return await this.analyticsModel.find({ userId }).lean();
    }

    async getUniqueVisitors(urlId: string): Promise<number> {
        const uniqueVisitors = await this.analyticsModel.distinct('userId', { urlId });
        return uniqueVisitors.length;
    }

    async getDeviceAnalytics(urlId: string): Promise<any> {
        return await this.analyticsModel.aggregate([
            { $match: { urlId } },
            {
                $group: {
                    _id: '$deviceType',
                    uniqueClicks: { $addToSet: '$visitorId' },
                    totalClicks: { $sum: 1 }
                }
            },
            {
                $project: {
                    deviceType: '$_id',
                    uniqueClicks: { $size: '$uniqueClicks' },
                    totalClicks: 1,
                    _id: 0
                }
            }
        ]);
    }

    async getOsAnalytics(urlId: string): Promise<any> {
        return await this.analyticsModel.aggregate([
            { $match: { urlId } },
            {
                $group: {
                    _id: '$osType',
                    uniqueClicks: { $addToSet: '$visitorId' },
                    totalClicks: { $sum: 1 }
                }
            },
            {
                $project: {
                    osType: '$_id',
                    uniqueClicks: { $size: '$uniqueClicks' },
                    totalClicks: 1,
                    _id: 0
                }
            }
        ]);
    }
}