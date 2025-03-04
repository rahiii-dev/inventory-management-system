import { Model, Document, FilterQuery, QueryOptions } from 'mongoose';
import { IMongoRepository, IPaginationResponse } from './repository.interface';
import { InternalError } from '../utils/app.errors';

export class MongoBaseRepository<T extends Document> implements IMongoRepository<T> {
  protected repository: Model<T>;

  constructor(repository: Model<T>) {
    this.repository = repository;
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const entity = new this.repository(data);
      return await entity.save();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(id: string, select?: string): Promise<T | null> {
    try {
      return await this.repository.findById(id).select(select || '');
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.repository.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repository.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(filter: FilterQuery<T> = {}, options: QueryOptions = {}, select?: string): Promise<T[]> {
    try {
      return await this.repository.find(filter, null, { ...options, select: select || '' }) as unknown as T[];
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(filter: FilterQuery<T> = {}, options: QueryOptions = {}, select?: string): Promise<T | null> {
    try {
      return await this.repository.findOne(filter, null, { ...options, select: select || '' });
    } catch (error) {
      this.handleError(error);
    }
  }

  async paginate(
    filter: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 10,
    options: QueryOptions = {},
    select?: string
  ): Promise<IPaginationResponse<T>> {
    try {
      if (page < 1) page = 1;
      if (limit < 1) limit = 1;

      const skip = (page - 1) * limit;

      const data = await this.repository.find(filter, null, { ...options, skip, limit, select: select || '' }).exec();

      const total = await this.repository.countDocuments(filter).exec();

      const totalPages = Math.ceil(total / limit);

      const hasPreviousPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        data,
        total,
        limit,
        currentPage: page,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      throw new InternalError(error.message);
    }
    throw new InternalError('An unknown error occurred');
  }
}
