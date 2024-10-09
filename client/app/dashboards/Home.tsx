// app/dashboards/Home.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Nabar';
import SideNavbar from './SideNavbar';
import styles from './scss/home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEnvelope, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import ChatInput from '../components/ChatInput';
import MessageList from '../components/MessageList';
import useChat from '../hooks/useChat';

const Home = () => {
    const [isGroupsOpen, setIsGroupsOpen] = useState(false);
    const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState(false);

    const toggleGroups = () => {
        setIsGroupsOpen(!isGroupsOpen);
    };

    const toggleDirectMessages = () => {
        setIsDirectMessagesOpen(!isDirectMessagesOpen);
    };

    const { chatId } = useParams(); // Use useParams to get chatId
    const isGroupChat = true; 
    const { messages } = useChat(chatId as string, isGroupChat);

    return (
        <>
            <Navbar />
            <SideNavbar />

            <div className="container">
                <div className={styles.mainContainer}>
                    <div className="row">
                        <div className="col-xxl-3 col-xl-3 col-md-3 col-sm-3">
                            <div className={styles.qluAi}>
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
                                            <h3 className={styles.dropdownHeader}>
                                                <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                                                <span className={styles.directText}>Direct Messages</span>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className={styles.parentSide1}>
                                        <div className={styles.groups}>
                                            <h3 onClick={toggleGroups} className={styles.dropdownHeader}>
                                                <FontAwesomeIcon icon={faChevronDown} className={styles.icon} />
                                                <span className={styles.groupText}>Groups</span>
                                            </h3>
                                            {isGroupsOpen && (
                                                <ul className={styles.dropdownList}>
                                                    <li>Log Rocket Group</li>
                                                    <li>Random</li>
                                                    <li>General</li>
                                                    <li>HR</li>
                                                </ul>
                                            )}
                                        </div>
                                        <div className={styles.directMessages}>
                                            <h3 onClick={toggleDirectMessages} className={styles.dropdownHeader}>
                                                <FontAwesomeIcon icon={faChevronDown} className={styles.icon} />
                                                <span className={styles.directText}>Direct Messages</span>
                                            </h3>
                                            {isDirectMessagesOpen && (
                                                <ul className={styles.dropdownList}>
                                                    <li className={styles.activeUser}>Aashir Manzoor</li>
                                                    <li>Fahad Jalal</li>
                                                    <li>Yashua Parvez</li>
                                                    <li>Aneeq Akber</li>
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-9 col-xl-9 col-md-9 col-sm-9">
                            <div className="container-fluid">
                                <MessageList messages={messages} />
                                <ChatInput chatId={chatId as string} isGroupChat={isGroupChat} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
