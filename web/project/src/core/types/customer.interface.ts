export interface IAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface ICustomer {
    id: string;
    managerId: string
    fullName: string;
    mobile: string;
    address: IAddress
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}