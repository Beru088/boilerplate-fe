import { AppConfig } from "@/configs/api";

export const getMediaUrl = (path: string) => {
    if (!path) return '';

    return `${AppConfig.mediaUrl}/${path}`;
};