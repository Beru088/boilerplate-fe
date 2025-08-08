import { IRole } from "./role";

export interface IUser {
    id: number;
    email: string;
    name: string;
    role: IRole;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string
}

export interface IUserOption {
    search: string;
    role: string;
    status: string;
    skip: number;
    take: number;
}