import { UserPayload } from "../../../core/token/user/userPayload";
import { UserDto } from "../../user/dto/user.dto";

export interface ITokenService {
    generateUserToken(pyload: UserDto): string;
    generateRefreshToken(pyload: UserDto): string;
    verifyRefreshToken(token: string): UserPayload;
}