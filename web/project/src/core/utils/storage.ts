import { IUser } from "../types/user.interface";

export const getUser = (): IUser | null => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
};

export const setUser = (user: IUser) => {
    localStorage.setItem("user", JSON.stringify(user));
};

export const clearUser = () => {
    if (localStorage.getItem("user")) {
        localStorage.removeItem("user");
    }
}

export const getToken = () => localStorage.getItem("token") || null;

export const setToken = (token: string) => {
    localStorage.setItem("token", token);
}

export const clearToken = () => {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
    }
}
