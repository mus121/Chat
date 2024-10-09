// components/ProtectedRoute.tsx
"use client"; // Mark this as a client component
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Cookies from 'js-cookie'; // Import js-cookie library

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token'); 
        
        const isAuthenticated = !!token; 

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
