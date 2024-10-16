
'use client';
import styles from '../../../styles/scss/landing.module.scss';
import SignupModal from './SignupModal';
import { Righteous, Roboto, Inter } from 'next/font/google';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from "next/navigation";
import { auth } from "../../hooks/auth";


const righteous = Righteous({ weight: '400', subsets: ['latin'] });
const roboto = Roboto({ weight: '400', subsets: ['latin'] });
const inter = Inter({ weight: '700', subsets: ['latin'] });

const SignupButton = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [formData, setFormData] = useState({ email: '', display_name: '', username: '', password: '' });
 
  const router = useRouter();

  const {
      signupErrorMessage,
      signupSuccessMessage,
      signup,
  } = auth();

  const handleSignupClose = () => setShowSignup(false);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitSignup = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await signup(formData);
      if (!signupErrorMessage) {
          handleSignupClose();
      }
  };


  return (
    <>
      <div className={`${styles.button} d-flex`}>
        <div className={styles.signupMain}>
          <button type="button" className={`${inter.className} btn`}
            style={{ backgroundColor: '#06334D', color: '#E6EEF2', padding: '8px 45px', borderRadius: '5px' }}
            onClick={() => setShowSignup(true)}  >Signup</button>
        </div>
      </div>
      <SignupModal showSignup={showSignup} handleSignupClose={handleSignupClose} />
    </>
  )
}

export default SignupButton
