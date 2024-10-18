// components/LogoutButton.tsx
"use client";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query'; 
import { useQueryClient } from 'react-query';

const logoutRequest = async () => {
    const response = await fetch('http://localhost:5001/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }
    return response.json();
};

const LogoutButton: React.FC = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const { mutate, isLoading, error } = useMutation(logoutRequest, {
        onSuccess: () => {
            // Remove cookies after successful logout
            Cookies.remove('authToken');
            Cookies.remove('email');
            Cookies.remove('userId');

            queryClient.clear();
            router.push('/');
        },
        onError: (error) => {
            console.error('Error during logout:', error);
        },
    });

    const handleLogout = () => { 
        mutate(); 
    };

    return (
        <button onClick={handleLogout} type='button' className='btn' style={{
            backgroundColor: 'none',
            border: '1px solid white',
            color: '#E6EEF2',
            padding: '4px 12px'
        }} disabled={isLoading}>
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    );
};

export default LogoutButton;
