// app/utils/api.ts

export const apiFetch = async (url: string, options: RequestInit) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return response.json();
};
