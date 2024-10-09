// app/hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { apiFetch } from '../utils/api';
import router from 'next/router';


interface User {
    id: string;
    displayName: string;
}

interface SignupData {
    email: string;
    password: string;
    displayName: string; 
    username: string
}

interface LoginData {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: User; // Include user data in the response
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [signupErrorMessage, setSignupErrorMessage] = useState<string>('');
    const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
    const [signupSuccessMessage, setSignupSuccessMessage] = useState<string>('');

    useEffect(() => {
        const token = Cookies.get('token');
        console.log("Token",token)
        if (token) {  
            const userData: User = { id: 'decodedUserId', displayName: 'Decoded Display Name' };
            setUser(userData);
        }
    }, []);

    const handleSignup = async (formData: SignupData) => {
        try {
            const { token, user: userInfo }: AuthResponse = await apiFetch('http://localhost:5001/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            const cook = Cookies.set('token', token, { expires: 7 }); 
            console.log("Cook",cook)
            setUser(userInfo); 
            setSignupSuccessMessage('Signup Successful!');
            setSignupErrorMessage('');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup.';
            setSignupErrorMessage(errorMessage);
            setSignupSuccessMessage('');
        }
    };
    

    const handleLogin = async (loginData: LoginData) => {
        try {
            const { token, user: userInfo }: AuthResponse = await apiFetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const cook = Cookies.set('token', token, { expires: 7 }); 
            console.log("Cook",cook)
            setUser(userInfo); 
            return true; 
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during login.';
            setLoginErrorMessage(errorMessage);
            return false; 
        }
    };

    const handleLogout = async () => {
        await fetch('http://localhost:5001/api/logout', { method: 'POST' });
        Cookies.remove('token');
        setUser(null); 
        router.push('/');
    };
    
    return {
        user,
        signupErrorMessage,
        loginErrorMessage,
        signupSuccessMessage,
        handleSignup,
        handleLogin,
        handleLogout,
    };
};
