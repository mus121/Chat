'use client';
import React, { useState } from 'react';
import Navbar from './Nabar';
import SideNavbar from './SideNavbar';
import ChatArea from './HomePage/ChatArea';
import styles from './scss/home.module.scss';
import Sidebar from './HomePage/Sidebar';

const Home: React.FC = () => {
    const [selectedEmail, setSelectedEmail] = useState<string>('');

    return (
        <>
            <Navbar />
            <SideNavbar />
            <div className="container">
                <div className={styles.mainContainer}>
                    <div className="row">
                        <div className={styles.chatMap}>
                            <div className={styles.qluAi}>
                                <Sidebar 
                                    selectedEmail={selectedEmail} 
                                    setSelectedEmail={setSelectedEmail} 
                                />
                            </div>
                        </div>
                        <ChatArea selectedEmail={selectedEmail} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
