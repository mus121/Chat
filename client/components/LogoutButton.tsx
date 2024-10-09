// components/LogoutButton.tsx
"use client"; // Ensure it's a client-side component
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Import js-cookie


const LogoutButton: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('token'); 
        router.push('/'); 
    };

    return (
        <button onClick={handleLogout} type='button' className='btn' style={{backgroundColor:'none',
        border:'1px solid white',color:'#E6EEF2', padding:'4px 12px'}}>
            Logout
        </button>
    );
};

export default LogoutButton;
