import jwt, { JwtPayload, SignOptions, Secret } from 'jsonwebtoken';
import { Request } from 'express';

export interface BasePayload extends JwtPayload {}

export interface PayloadRequest<T extends BasePayload> extends Request {
    payload?: T;
}

export interface TokenServiceOptions {
    secretKey: string;
    options?: SignOptions;
}

export class TokenService<T extends BasePayload> {
    private readonly secretKey: Secret;
    private readonly options: SignOptions;

    constructor(options: TokenServiceOptions) {
        this.secretKey = options.secretKey;
        this.options = options.options || {};
    }

    public generateToken(payload: T, options?: SignOptions): string {
        try {
            return jwt.sign(payload, this.secretKey, options || this.options);
        } catch (error) {
            console.error("JWT Signing Error:", error);
            throw new Error('Error generating JWT token');
        }
    }

    public verifyToken(token: string): T {
        try {
            return jwt.verify(token, this.secretKey) as T;
        } catch (error) {
            console.error("JWT Verification Error:", error);
            throw new Error('Invalid or expired JWT token');
        }
    }

    public decodeToken(token: string): T | null {
        const decoded = jwt.decode(token);
        return (decoded && typeof decoded === 'object') ? (decoded as T) : null;
    }
}
