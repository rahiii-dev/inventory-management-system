import { BasePayload } from "../tokenService";

export interface UserPayload extends BasePayload {
    userId: string;
}
