import { UserCreateDto, UserDto, UserValidateDto } from "../dto/user.dto";

export interface IUserService {
    validateUser(data: UserValidateDto): Promise<UserDto>;
    createUser(data: UserCreateDto): Promise<UserDto>;
    getUserById(id: string): Promise<UserDto>;
    getUserByEmail(email: string): Promise<UserDto>;
    setRefreshToken(id: string, token: string): Promise<string>;
    getRefreshToken(id: string): Promise<string>;
}