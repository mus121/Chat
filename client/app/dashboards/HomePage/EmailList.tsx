'use client';

import React, { useState } from 'react';
import { useFetchEmails } from '../../hooks/email';
import styles from '../scss/home.module.scss';

interface EmailListProps {
    setSelectedEmail: (email: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({ setSelectedEmail }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { data: emails = [], isLoading, isError } = useFetchEmails();

    const filteredEmails = emails.filter((email: string) =>
        email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.emailList}>
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
            />
            <ul className={styles.dropdownList}>
                {filteredEmails.map((email: string, index: number) => (
                    <li
                        key={index}
                        onClick={() => setSelectedEmail(email)}
                        className={styles.emails}
                    >
                        {email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmailList;
