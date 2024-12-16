import IClickAnalytics from "@/domain/entities/IClickAnalytics";
import { Schema, model } from "mongoose";

const clickAnalyticsSchema = new Schema<IClickAnalytics>({
    urlId: { type: Schema.Types.ObjectId, ref: 'Url', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    deviceType: { type: String, required: true },
    osType: { type: String, required: true },
    browser: { type: String, required: true },
    country: String,
    referrer: String
}, {
    versionKey: false
});

clickAnalyticsSchema.index({ urlId: 1, timestamp: -1 });
clickAnalyticsSchema.index({ userId: 1, timestamp: -1 });
clickAnalyticsSchema.index({ urlId: 1 });
clickAnalyticsSchema.index({ urlId: 1, deviceType: 1, osType: 1 });

const ClickAnalytics = model<IClickAnalytics>('ClickAnalytics', clickAnalyticsSchema);
export default ClickAnalytics;