import { UserCreateDto, UserDto, UserValidateDto } from "./dto/user.dto";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { IUserService } from "./interfaces/user.service.interface";
import { inject, injectable } from "inversify";
import TYPES from '../../core/container/container.types';
import { isValidObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../../core/utils/app.errors";
import { IUser } from "./user.modal";

@injectable()
export class UserService implements IUserService {
  @inject(TYPES.UserRepository) private repo!: IUserRepository;

  async validateUser(data: UserValidateDto) {
    const user = await this.repo.findByEmail(data.email);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    if (! await user.validatePassword(data.password)) {
      throw new BadRequestError('Invalid password');
    }

    return this.userResponse(user);
  }

  async createUser(data: UserCreateDto) {
    if (await this.repo.isEmailExist(data.email)) {
      throw new BadRequestError('Email already exists');
    }

    const user = await this.repo.create({ ...data });

    return this.userResponse(user);
  }

  async getUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestError('Invalid user ID format');
    }

    const user = await this.repo.findById(id);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return this.userResponse(user);
  }

  async getUserByEmail(email: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return this.userResponse(user);
  }

  async setRefreshToken(id: string, token: string): Promise<string> {
    const user = await this.repo.update(id, { refreshToken: token });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return "Refresh token updated";
  }

  async getRefreshToken(id: string): Promise<string> {
    if (!isValidObjectId(id)) {
      throw new BadRequestError("Invalid userId");
    }

    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user.refreshToken;
  }

  private userResponse(userData: IUser): UserDto {
    return {
      id: userData.id,
      fullname: userData.fullname,
      email: userData.email,
      createAt: userData.createdAt,
      updatedAt: userData.updatedAt
    }
  }
}