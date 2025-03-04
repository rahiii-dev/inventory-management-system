import { MongoBaseRepository } from "../../core/repository/mongo.base.repository";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { injectable } from "inversify";
import User, { IUser } from "./user.modal";

@injectable()
export class UserRepository extends MongoBaseRepository<IUser> implements IUserRepository {
    constructor() {
        super(User);
    }

    async isEmailExist(email: string): Promise<boolean> {
        const exist = await this.findOne({email});
        return !!exist;
    }
    
    async findByEmail(email: string): Promise<IUser | null> {
        return await this.findOne({email});
    }
}