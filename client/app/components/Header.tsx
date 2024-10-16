// components/Header.tsx
'use client'

import Link from 'next/link';
import styles from '../../styles/scss/Header.module.scss';
import Image from 'next/image';
import { Roboto } from 'next/font/google';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';

const roboto = Roboto({
    weight: '700',
    subsets: ['latin'],
});

const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    // Function to toggle the dropdown
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Image src="/images/Pulse.png" alt="Pulse Logo"  width={100}  height={50} className={styles.logo} />
            </div>
            <div className={styles.logo1Container} style={{
                position: 'absolute',
                left: '130px'
            }}>
                <Image src="/images/Vector 1.png" alt="Vector Icon" width={40} height={20} className={styles.logo1} />
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
                        <Image src="/images/Vector.png" alt="Dropdown Icon" className={styles.dropdownImage} width={50} height={20} />
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
            </nav>
        </header>
    );
};

export default Header;
