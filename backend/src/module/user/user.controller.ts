import { Request, Response } from 'express';
import { IUserService } from "./interfaces/user.service.interface";
import { inject, injectable } from "inversify";
import TYPES from '../../core/container/container.types';
import asyncWrapper from '../../core/utils/asyncWrapper';
import { ITokenService } from '../external/token/token.service.interface';
import { AuthRequest } from '../../core/token/user/userRequest';

@injectable()
export class UserController {
    @inject(TYPES.UserService) private userService!: IUserService;
    @inject(TYPES.TokenService) private tokenService!: ITokenService;

    /**
   * @route GET /user/login
   * @scope Public
   **/
    public login = asyncWrapper(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await this.userService.validateUser({ email, password });
        const token = this.tokenService.generateUserToken(user);
        const refreashToken = this.tokenService.generateRefreshToken(user);
        await this.userService.setRefreshToken(user.id, refreashToken);
        res.json({ user, token });
    });


    /**
   * @route POST /user
   * @scope Protected
   **/
    public getUser = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId;
        const user = await this.userService.getUserById(userId!);
        res.json(user);
    })

    /**
   * @route POST /user/refresh-token
   * @scope Public
   **/
    public refreshToken = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { userId } = req.body;
        const refreshToken = await this.userService.getRefreshToken(userId);
        this.tokenService.verifyRefreshToken(refreshToken);
        const user = await this.userService.getUserById(userId);
        const token = this.tokenService.generateUserToken(user);
        return res.json({ token });
    })

}
