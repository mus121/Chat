'use client';

import React, { useState } from 'react';
import styles from '../scss/home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import EmailList from './EmailList';

interface SidebarProps {
    selectedEmail: string;
    setSelectedEmail: (email: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedEmail, setSelectedEmail }) => {
    const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState<boolean>(false);

    const toggleDirectMessages = () => {
        setIsDirectMessagesOpen((prev) => !prev);
    };

    return (
        <div className={styles.sidebar}>
            <h2 className={styles.qluRequire}>QLU Recruiting</h2>
            <div className={styles.parentSide}>
                <div className={styles.groups}>
                    <h3 className={styles.dropdownHeader}>
                        <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                        <span className={styles.groupText}>Groups</span>
                    </h3>
                </div>

                <div className={styles.directMessages}>
                    <h3 onClick={toggleDirectMessages} className={styles.dropdownHeader}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                        <span className={styles.directText}>Direct Messages</span>
                    </h3>
                </div>

                {isDirectMessagesOpen && <EmailList setSelectedEmail={setSelectedEmail} />}
            </div>
        </div>
    );
};

export default Sidebar;
