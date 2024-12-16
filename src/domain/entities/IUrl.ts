import IUser from "./IUser";

export default interface IUrl {
    readonly _id?: string;
    readonly userId?: IUser['_id'];
    readonly longUrl?: string;
    readonly shortUrl?: string;
    readonly customAlias?: string;
    readonly topic?: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly accessCount?: number;
}