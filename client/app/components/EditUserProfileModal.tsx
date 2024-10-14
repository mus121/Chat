// components/EditUserProfileModal.tsx
import {useEffect, useState} from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from '../../styles/scss/EditProfile.module.scss'
import axios from 'axios';

interface EditUserProfileModalProps {
  show: boolean;
  handleClose: () => void;
}

const EditUserProfileModal: React.FC<EditUserProfileModalProps> = ({ show, handleClose }) => {

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  useEffect(()=>{
    const fetchProfile = async () =>{
      try {
        const response = await axios.get('http://localhost:5001/api/auth/profile');
        const {display_name, username, email} = response.data;
        setDisplayName(display_name || '');
        setUsername(username || '');
        setEmail(email || '');
      } catch (error) {
        console.error('Errro Fetching Profile',error);
      }
      fetchProfile();
    }
  },[]);

  // Handle form Submission
  const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault();

    try {
      const response = await axios.put('http://localhost:5001/api/auth/profile',{
        display_name : displayName,
        username: username,
        email: email
      });
      console.log('Profile Updated Successfully', response.data);
    } catch (error) {
      console.error('Error Uodating Profile', error);
    }
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className={styles.edituserprofile}>Edit your Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add form fields for editing user details */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className={`${styles.editusername} form-label`}>Display Name</label>
            <input type="text" className={`${styles.inputfield} form-control`} value={displayName} onChange={(e) => setDisplayName(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className={`${styles.editusername} form-label`}>Username</label>
            <input type="text" className={`${styles.inputfield} form-control`}  value={username} onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className={`${styles.editusername} form-label`}>email</label>
            <input type='email' className={`${styles.inputfield} form-control`}   value={email} onChange={(e)=> setEmail(e.target.value)}/>
          </div>
          {/* Add more fields as needed */}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="" onClick={handleClose} className={styles.closeButton}>
          Close
        </Button>
        <Button variant="" onClick={handleClose} className={styles.saveButton} type='submit'>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserProfileModal;
