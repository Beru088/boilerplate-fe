export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IApiError {
    message: string;
    status?: number;
}
