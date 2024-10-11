// app/utils/api.ts

export const apiFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
    const response = await fetch(url, options);
    
    if (!response.ok) {
        let errorMessage = 'An error occurred'; // Default message
        try {
            const error = await response.json();
            errorMessage = error.message || errorMessage; 
        } catch (e) {
            
            console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
    }

    
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
        return response.json(); 
    }

    throw new Error('Response is not JSON');
};
