import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postRequest, getRequest } from '@/services/apiServices';
import { RegisterData, FormData } from '@/types';
import {useStore} from "@/store"


export const useUserActions = (token?: string | null) => {
  const queryClient = useQueryClient();

    const useGetUser = (id: string | undefined) => {
        return useQuery({
            queryKey: ['single-user', id],
            queryFn: async () => {
            try {
                const response = await getRequest(`/user/${id}`, undefined, token);
                return response.data;
            } catch (error) {
                throw error;
            } 
            },
            
        });
    }

    const useGetAllUsers = () => {
        return useQuery({
            queryKey: ['all-users'],
            queryFn: async () => {
            try {
                const response = await getRequest(`/user`, undefined, token);
                return response.data;
            } catch (error) {
                throw error;
            } 
            },
            
        });
    }

    const useRegister = () => {
        return useMutation({
                mutationFn: async (formData: RegisterData) => {
                return postRequest('/user/register', formData, { withCredentials: true });
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['all-users'] });
            },
        });
    };

    const useLogin = () => {
        const setUser = useStore((state) => state.setUser);

        return useMutation({
            mutationFn: async (formData: FormData) => {
                const response = await postRequest('/user/login', formData, { withCredentials: true });
                const token = response?.headers?.authorization?.split(' ')[1];
                if (token) {
                    setUser(token);
                }

                return response;
            },
        });
    };

    return {
        useGetUser,
        useGetAllUsers,
        useRegister,
        useLogin
    }
}
