// app/hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { apiFetch } from '../utils/api';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

interface User {
    id: string;
    displayName: string;
}

interface SignupData {
    email: string;
    password: string;
    displayName: string; 
    username: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface AuthResponse {
    authToken: string;
    user: User;
}

interface DecodedToken {
    id: string;          
    displayName: string; 
    exp: number;       
}

export const useAuth = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [signupErrorMessage, setSignupErrorMessage] = useState<string>('');
    const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
    const [signupSuccessMessage, setSignupSuccessMessage] = useState<string>('');

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        if (authToken) {
            try {
                const decodedToken: DecodedToken = jwtDecode<DecodedToken>(authToken);
                const userData: User = {
                    id: decodedToken.id,          
                    displayName: decodedToken.displayName  
                };
                setUser(userData);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);
    
    const handleSignup = async (formData: SignupData) => {
        try {
            const { authToken, user: userInfo }: AuthResponse = await apiFetch('http://localhost:5001/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
    
            Cookies.set('authToken', authToken, { expires: 7 }); 
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
            const { authToken, user }: AuthResponse = await apiFetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(loginData),
            });
            Cookies.set('authToken', authToken, { expires: 7 });
            setUser(user); // Set user after login
            
            return true; 
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during login.';
            setLoginErrorMessage(errorMessage);
            return false; 
        }
    };

    const handleLogout = async () => {
        await fetch('http://localhost:5001/api/logout', { method: 'POST' });
        Cookies.remove('authToken');
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
