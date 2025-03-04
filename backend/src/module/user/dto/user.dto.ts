export interface UserCreateDto {
    fullname: string;
    email: string;
    password: string;
}

export interface UserValidateDto {
    email: string;
    password: string;
}


export interface UserDto {
    id: string;
    fullname: string;
    email: string;
    createAt: Date;
    updatedAt: Date;
}
