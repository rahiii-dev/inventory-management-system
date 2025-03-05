import { IAddress } from "../customer.modal";

export interface CreateCustomerDTO {
    managerId: string;
    fullName: string;
    mobile: string;
    address: IAddress
}

export interface UpdateCustomerDTO {
    fullName?: string;
    mobile?: string;
    address?: IAddress
}

export interface CustomerDTO {
    id: string;
    managerId: string
    fullName: string;
    mobile: string;
    address: IAddress
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
