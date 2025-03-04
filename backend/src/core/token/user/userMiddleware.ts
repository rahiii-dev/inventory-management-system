import { AuthRequest } from "./userRequest";
import { Response, NextFunction, RequestHandler } from 'express';
import { userTokenService } from "./userTokenService";

export const isAuthenticated: RequestHandler = ((req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = userTokenService.verifyToken(token);
        req.payload = payload;
        next();
        
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}) as RequestHandler;

