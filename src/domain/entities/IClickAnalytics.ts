import IUrl from "./IUrl";

export default interface IClickAnalytics {
    readonly _id?: string;
    readonly urlId?: IUrl["_id"];
    readonly userId?: IUrl["_id"];
    readonly timestamp?: Date | string;
    readonly ipAddress?: string;
    readonly userAgent?: string;
    readonly deviceType?: string;
    readonly osType?: string;
    readonly browser?: string;
    readonly country?: string;
    readonly referrer?: string;
}
