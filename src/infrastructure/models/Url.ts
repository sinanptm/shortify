import IUrl from "@/domain/entities/IUrl";
import { Schema, model } from "mongoose";

const urlSchema = new Schema<IUrl>({
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    customAlias: { type: String, sparse: true, unique: true },
    topic: { type: String, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    lastAccessed: { type: Date }
}, {
    versionKey: false,
    timestamps: true
});

urlSchema.index({ userId: 1, topic: 1 });
urlSchema.index({ createdAt: -1 });

const Url = model<IUrl>('Url', urlSchema);
export default Url;