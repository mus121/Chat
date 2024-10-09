// components/Header.tsx

import Link from 'next/link';
import styles from '../styles/scss/Header.module.scss';
import Image from 'next/image'; // Import the Image component
import { Roboto } from 'next/font/google';
import { useState } from 'react'; // Import useState
import { useRouter } from 'next/navigation'; // Import useRouter

const roboto = Roboto({
    weight: '700',
    subsets: ['latin'],
});

const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
    const router = useRouter(); // Initialize useRouter

    // Function to toggle the dropdown
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token
        router.push('/'); // Redirect to the landing page
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Image
                    src="/images/Pulse.png" // Path relative to the public directory
                    alt="Pulse Logo"
                    width={100}             // Set the desired width
                    height={50}             // Set the desired height
                    className={styles.logo} // Add styles if needed
                />
            </div>
            <div className={styles.logo1Container}>
                <Image
                    src="/images/Vector1.png" // Path relative to the public directory
                    alt="Vector Icon"
                    width={40}              // Set the desired width
                    height={20}             // Set the desired height
                    className={styles.logo1} // Add styles if needed
                />
            </div>

            <nav className={styles.navContainer}>
                <div className={styles.navItem}>
                    <Link href="/" className={`${styles.nav} ${roboto.className}`}>Privacy</Link>
                </div>
                <div className={styles.navItem}>
                    <Link href="/" className={`${styles.nav} ${roboto.className}`}>Help Center</Link>
                </div>
                <div className={styles.navItem}>
                    <Link href="/" className={`${styles.nav} ${roboto.className}`}>Pulse Web</Link>
                </div>
                <div className={styles.navItem}>
                    {/* Download Link with Dropdown and Image */}
                    <div className={styles.dropdown} onClick={toggleDropdown}>
                        <Link href="/" className={`${styles.nav} ${roboto.className}`}>Download</Link>
                        <Image 
                            src="/images/Vector.png"
                            alt="Dropdown Icon" 
                            className={styles.dropdownImage} 
                            width={50}            // Width as a percentage of the parent container
                            height={20}           // Click on the image also toggles the dropdown
                        />
                    </div>
                    {isDropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            <Link href="/download/windows" className={styles.dropdownItem}>Windows</Link>
                            <Link href="/download/mac" className={styles.dropdownItem}>Mac</Link>
                            <Link href="/download/linux" className={styles.dropdownItem}>Linux</Link>
                        </div>
                    )}
                </div>
                <div className={styles.navItem}>
                    <Link href="/" className={`${styles.nav} ${styles.tryPulse}`}>Try Pulse</Link>
                </div>
                <div className={styles.navItem}>
                    <button onClick={handleLogout} className={`${styles.nav} ${styles.logoutButton}`}>
                        Logout
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
