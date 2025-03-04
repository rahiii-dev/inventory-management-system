import { IMongoRepository } from "../../../core/repository/repository.interface";
import { IUser } from "../user.modal";

export interface IUserRepository extends IMongoRepository<IUser> {
    isEmailExist(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<IUser | null>;
}