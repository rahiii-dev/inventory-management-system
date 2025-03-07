import axios from "../lib/axios";
import { ICustomer } from "../types/customer.interface";
import { IPaginationResponse } from "../types/pagination.interface";
import { apiWrapper } from "../utils/helper";

const baseUrl = "/customer";

export const listCustomers = async (filter: {active?: boolean, query?: string, page: number, limit: number}): Promise<IPaginationResponse<ICustomer>> => {
    return (await apiWrapper(axios.get<IPaginationResponse<ICustomer>>(`${baseUrl}/list`, {
        params: {...filter}
    }))).data;
};
export const createCustomer = async (data: {    fullName: string;
    mobile: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }}): Promise<ICustomer> => {
    return (await apiWrapper(axios.post<ICustomer>(`${baseUrl}`, data))).data;
};
export const updateCustomer = async (id: string, data: {    fullName: string;
    mobile: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }}): Promise<ICustomer> => {
    return (await apiWrapper(axios.put<ICustomer>(`${baseUrl}/${id}`, data))).data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
    return (await apiWrapper(axios.put<void>(`${baseUrl}/delete/${id}`))).data;
};
export const restoreCustomer = async (id: string): Promise<void> => {
    return (await apiWrapper(axios.put<void>(`${baseUrl}/restore/${id}`))).data;
};