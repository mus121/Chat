// components/UserProfileModal.tsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from '../styles/scss/Userprofile.module.scss';
import EditUserProfileModal from './EditUserProfileModal';

interface UserProfileModalProps {
    show: boolean; 
    handleClose: () => void; 
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ show, handleClose }) => {
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditClick = () => {
        setShowEditModal(true); // Open Edit modal
        handleClose(); // Close UserProfile modal
    };

    const handleEditModalClose = () => {
        setShowEditModal(false); // Close Edit modal
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton >
                    <Modal.Title className={styles.userprofile}>Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.modaledit}>
                        <div className={styles.modaledit1}>
                            <h5>John Doe</h5>
                            <p className={styles.email}>johndoe@example.com</p>
                            <p className={styles.status}>Status will be shown here when ever a user set a status. Status will be shown here when ever a user set a status. Status will be shown here when ever a user set a status. Status will be shown here when ever a user set a status. </p>
                        </div>
                        <div className={styles.modaledit2}>
                            <button className={`${styles.btnEdit} btn`} onClick={handleEditClick}>
                                Edit
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Edit Profile Modal */}
            <EditUserProfileModal show={showEditModal} handleClose={handleEditModalClose} />
        </>
    );
};

export default UserProfileModal;
