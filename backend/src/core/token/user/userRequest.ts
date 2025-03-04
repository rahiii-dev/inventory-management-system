import { PayloadRequest } from "../tokenService";
import { UserPayload } from "./userPayload";

export interface AuthRequest extends PayloadRequest<UserPayload>{}
