export interface LoginCredentials {
    email: string;
    password: string;
}

export interface ApiError {
    message: string;
    status?: number;
}
