import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { IUser } from "../types/user.interface";
import { clearToken, clearUser, getUser, setToken, setUser as setUserInStorage } from "../utils/storage";

interface AuthContextType {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    login: (data: {user: IUser, token: string}) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    login: () => {},
    logout: () => {},
});

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuthContext must be used within an AuthProvider");
    }

    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        setUser(getUser());        
    }, []);

    const login = (data: {user: IUser, token: string}) => {
        setUserInStorage(data.user);
        setUser(data.user); 
        setToken(data.token);
    };

    const logout = () => {
        setUser(null);
        clearUser();
        clearToken();
    };

    return (
        <AuthContext.Provider value={{ user, setUser,  login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};