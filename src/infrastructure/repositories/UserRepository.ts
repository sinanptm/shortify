import IUser from "@/domain/entities/IUser";
import IUserRepository from "@/domain/interface/repositories/IUserRepository";
import User from "../models/User";

export default class UserRepository implements IUserRepository {
    userModel = User;
    async findByEmail(email: string): Promise<IUser | null> {
        return await this.userModel.findOne({ email }).lean();
    }
    async create(entity: IUser): Promise<IUser> {
        return await this.userModel.create(entity);
    }
    async findById(id: string): Promise<IUser | null> {
        return await this.userModel.findById(id);
    }
    async update(id: string, entity: IUser): Promise<IUser | null> {
        return await this.userModel.findByIdAndUpdate(id, entity);
    }
    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id);
    }

    async findByGoogleId(googleId: string): Promise<IUser | null> {
        return await this.userModel.findOne({ googleId }).lean();
    }

}