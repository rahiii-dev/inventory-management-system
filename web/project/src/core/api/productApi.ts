import axios from "../lib/axios";
import { IPaginationResponse } from "../types/pagination.interface";
import { IProduct } from "../types/product.interface";
import { apiWrapper } from "../utils/helper";

const baseUrl = "/product";

export const listProducts = async (filter: {query?: string, page: number, limit: number}): Promise<IPaginationResponse<IProduct>> => {
    return (await apiWrapper(axios.get<IPaginationResponse<IProduct>>(`${baseUrl}/list`, {
        params: {...filter}
    }))).data;
};
export const createProduct = async (data: {name: string, description: string, quantity: number, price: number}): Promise<IProduct> => {
    return (await apiWrapper(axios.post<IProduct>(`${baseUrl}`, data))).data;
};
export const updateProduct = async (id: string, data: {name: string, description: string, quantity: number, price: number}): Promise<IProduct> => {
    return (await apiWrapper(axios.put<IProduct>(`${baseUrl}/${id}`, data))).data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    return (await apiWrapper(axios.put<void>(`${baseUrl}/delete/${id}`))).data;
};
export const restoreProduct = async (id: string): Promise<void> => {
    return (await apiWrapper(axios.put<void>(`${baseUrl}/restore/${id}`))).data;
};
