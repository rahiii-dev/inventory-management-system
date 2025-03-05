import axios from "../lib/axios";
import { IUser } from "../types/user.interface";
import { apiWrapper } from "../utils/helper";

export const loginUser = async (data: {email: string, password: string}): Promise<{user: IUser, token: string}> => {
    return (await apiWrapper(axios.post<{user: IUser, token: string}>(`/user/login`, data))).data;
};
