export default interface IUser {
    readonly _id?: string;
    readonly email?: string;
    readonly name?: string;
    readonly token?:string;
    readonly profile?:string;
    readonly googleId?:string;
}