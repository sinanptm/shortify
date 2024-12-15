import IUser from "@/domain/entities/IUser";
import IUserRepository from "@/domain/interface/repositories/IUserRepository";

export default class UserRepository implements IUserRepository{
    findByEmail(email: string): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
    create(entity: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<IUser | null> {
        throw new Error("Method not implemented.");
    }
    update(id: string, entity: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}