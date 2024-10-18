// app/hooks/useAuth.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { cook } from '@/app/actions';

export const auth = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [signupErrorMessage, setSignupErrorMessage] = useState('');
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [signupSuccessMessage, setSignupSuccessMessage] = useState('');

    const signupMutation = useMutation(
        async (formData) => {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }

            const { user } = await response.json();
            console.log(cook())
            
            return user;
        },
        {
            onSuccess: (userData) => {
                setUser(userData);
                setSignupSuccessMessage('Signup Successful!');
                setSignupErrorMessage('');
            },
            onError: (error: unknown) => {
                const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup.';
                setSignupErrorMessage(errorMessage);
                setSignupSuccessMessage('');
            },
        }
    );

    const loginMutation = useMutation(
        async (loginData) => {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const { authToken, user } = await response.json();
            cook();
            return user;
        },
        {
            onSuccess: (userData) => {
                setUser(userData);
                router.push('/dashboards');
            },
            onError: (error: unknown) => {
                setLoginErrorMessage(error instanceof Error ? error.message : 'An error occurred during login.');
            },
        }
    );

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', { method: 'POST' });

            if (response.ok) {
                setUser(null);
                router.push('/');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return {
        user,
        signupErrorMessage,
        loginErrorMessage,
        signupSuccessMessage,
        signup: signupMutation.mutateAsync,
        login: loginMutation.mutateAsync,
        handleLogout,
    };
};