export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    quantity: number;
}
export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
}
export interface ProductDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}