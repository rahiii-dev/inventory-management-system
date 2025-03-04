import { TokenService } from "../tokenService";
import { UserPayload } from "./userPayload";

export const userTokenService = new TokenService<UserPayload>({secretKey: process.env.JWT_SECRET_KEY!});