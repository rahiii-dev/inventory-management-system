import { AxiosError } from "axios";

export const handleApiError = (error: any) => {
    if(error instanceof AxiosError){
        return error.response?.data?.message || error.response?.data
    }

    return "Unknown Errors"
}

export const apiWrapper = async <T>(fn: Promise<T>): Promise<T> => {
    try {
        return await fn;
    } catch (error: any) {
        throw handleApiError(error);
    }
};

export const dateFormatter = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });  
} 


