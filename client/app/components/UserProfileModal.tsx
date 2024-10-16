// components/UserProfileModal.tsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from '../../styles/scss/Userprofile.module.scss';
import EditUserProfileModal from './EditUserProfileModal';
import profile from '../hooks/profile';


interface UserProfileModalProps {
    show: boolean;
    handleClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ show, handleClose }) => {
    const [showEditModal, setShowEditModal] = useState(false);

    const { data, error, isLoading } = profile();

    const handleEditClick = () => {
        setShowEditModal(true);
        handleClose();
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className={styles.userprofile}>Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading && <p>Loading...</p>}
                    {!isLoading && !error && (
                        <div className={styles.modaledit}>
                            <div className={styles.modaledit1}>
                                <h5><strong>Display Name: </strong> {data?.display_name}</h5>
                                <p className={styles.email}><strong>Username: </strong> {data?.username}</p>
                                <p className={styles.status}><strong>Email: </strong> {data?.email}</p>
                            </div>
                            <div className={styles.modaledit2}>
                                <button className={`${styles.btnEdit} btn`} onClick={handleEditClick}>
                                    Edit
                                </button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Edit Profile Modal */}
            <EditUserProfileModal show={showEditModal} handleClose={handleEditModalClose} />
        </>
    );
};

export default UserProfileModal;
