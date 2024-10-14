import React from 'react';
import styles from './scss/Navbar.module.scss';
import LogoutButton from '@/app/components/LogoutButton';

const Navbar = () => {
    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.search}>
                    <input type="text" placeholder="Search.." className={styles.searchInput}/>
                </div>
                <LogoutButton/>
            </nav>
        </>

    );
};

export default Navbar;
