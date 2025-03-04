import { FilterQuery, QueryOptions } from 'mongoose';


export interface IRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    findAll(filter: any, options?: any): Promise<T[]>;
    findOne(filter: any, options?: any): Promise<T | null>;
}

export interface IPaginationResponse<T> {
    data: T[];
    total: number;
    limit: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}


export interface IMongoRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string, select?: string): Promise<T | null>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    findAll(filter: FilterQuery<T>, options?: QueryOptions, select?: string): Promise<T[]>;
    findOne(filter: FilterQuery<T>, options?: QueryOptions, select?: string): Promise<T | null>;
    paginate(
        filter: FilterQuery<T>,
        page: number,
        limit: number,
        options?: QueryOptions,
        select?: string
    ): Promise<IPaginationResponse<T>>;
}

