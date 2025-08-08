'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { service } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import authConfig from '@/configs/auth';
import { ILoginCredentials } from '@/types/api';
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const authApi = {
        login: async (credentials: ILoginCredentials) => {
            const response = await service.post('/auth/login', credentials);

            return response.data;
        },

        logout: async () => {
            const response = await service.post('/auth/logout');

            return response.data;
        },

        getCurrentUser: async () => {
            const response = await service.get('/auth/me');

            return response.data;
        },
    };

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            const { user, token } = data;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem(authConfig.storageTokenKeyName);

                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem(authConfig.storageTokenKeyName, token);
            }
            queryClient.removeQueries({ queryKey: ['user'] });
            queryClient.setQueryData(['me'], { data: user });

            if (user.role.name === 'viewer') {
                router.push('/explore');
            } else {
                router.push('/admin');
            }
        },
        onError: (error) => {
            console.error('Login failed:', error);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem(authConfig.storageTokenKeyName);
            }
            queryClient.clear();
            router.push('/');
        },
        onError: (error) => {
            console.error('Logout failed:', error);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem(authConfig.storageTokenKeyName);
            }
            queryClient.clear();
            router.push('/');
        },
    });

    const { data: userData, isLoading, error } = useQuery({
        queryKey: ['me'],
        queryFn: authApi.getCurrentUser,
        retry: false,
        staleTime: 1000 * 60 * 5,
        enabled: isClient && typeof window !== 'undefined' && !!localStorage.getItem(authConfig.storageTokenKeyName),
    });

    const user = userData?.data;
    const isAuthenticated = !!user;

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        isLoginLoading: loginMutation.isPending,
        isLogoutLoading: logoutMutation.isPending,
    };
};