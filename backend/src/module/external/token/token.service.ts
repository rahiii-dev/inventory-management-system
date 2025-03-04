import { ITokenService } from "./token.service.interface";
import { injectable } from "inversify";
import { UserDto } from "../../user/dto/user.dto";
import { userTokenService } from "../../../core/token/user/userTokenService";
import { BadRequestError } from "../../../core/utils/app.errors";

@injectable()
export class TokenService implements ITokenService {
    generateUserToken(payload: UserDto): string {
        return userTokenService.generateToken({
            userId: payload.id,
        }, {
            expiresIn: '1h'
        });
    }
    
    generateRefreshToken(payload: UserDto): string {
        return userTokenService.generateToken({
            userId: payload.id,
        }, {
            expiresIn: '7d'
        });
    }

    verifyRefreshToken(token: string) {
        try {
           return userTokenService.verifyToken(token);
        } catch (error) {
            throw new BadRequestError("Invalid or expired token")
        }
    }
}