import IUser from "./IUser";

export default interface IUrl {
    readonly _id?: string;
    readonly userId?: IUser['_id'];
    readonly longUrl?: string;
    readonly shortUrl?: string;
    readonly customAlias?: string;
    readonly topic?: string;
    readonly clicks?: number;
    readonly lastAccessed?: Date | string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}
export interface IUrlWithClickCount extends IUrl {
    totalClicks: number;
    uniqueClicks: number;
}
