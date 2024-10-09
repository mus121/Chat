// components/EditUserProfileModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from '../styles/scss/EditProfile.module.scss'
interface EditUserProfileModalProps {
  show: boolean;
  handleClose: () => void;
}

const EditUserProfileModal: React.FC<EditUserProfileModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className={styles.edituserprofile}>Edit your Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add form fields for editing user details */}
        <form>
          <div className="mb-3">
            <label htmlFor="username" className={`${styles.editusername} form-label`}>Display Name</label>
            <input type="text" className={`${styles.inputfield} form-control`} id="username" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className={`${styles.editusername} form-label`}>Username</label>
            <input type="email" className={`${styles.inputfield} form-control`} id="email" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className={`${styles.editusername} form-label`}>status</label>
            <textarea className={`${styles.inputfield} form-control`}  id="exampleFormControlTextarea1" />
          </div>
          {/* Add more fields as needed */}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="" onClick={handleClose} className={styles.closeButton}>
          Close
        </Button>
        <Button variant="" onClick={handleClose} className={styles.saveButton}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserProfileModal;
