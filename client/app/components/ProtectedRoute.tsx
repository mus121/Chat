// components/ProtectedRoute.tsx
"use client"; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import {cook }from '../actions'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
            const isAuthenticated = !!cook(); 
            if (!isAuthenticated) {
                router.push('/'); 
            } else {
                setIsLoading(false); 
            }
    }, [router]);
    if (isLoading) {
        return <div>Loading...</div>; 
    }

    return <>{children}</>; 
};

export default ProtectedRoute;
