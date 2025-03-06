import axios from "../lib/axios";
import { apiWrapper } from "../utils/helper";
import { IPaginationResponse } from "../types/pagination.interface";
import { ISale } from "../types/sale.interface";

const baseUrl = "/sale";

export const listSales = async (filter: {query?: string, page: number, limit: number}): Promise<IPaginationResponse<ISale>> => {
    return (await apiWrapper(axios.get<IPaginationResponse<ISale>>(`${baseUrl}/list`, {
        params: {...filter}
    }))).data;
};

export const createSales = async (data: {
    items: {id: string, quantity: number}[],
    paymentMethod: string,
    customer: string,
}): Promise<ISale> => {
    return (await apiWrapper(axios.post<ISale>(`${baseUrl}`, data))).data;
};