// components/SignupModal.tsx
import Head from "next/head";
import styles from '../../../styles/scss/landing.module.scss';
import { Righteous, Inter } from 'next/font/google';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';
import { auth } from "../../hooks/auth"; 

const righteous = Righteous({ weight: '400', subsets: ['latin'] });
const inter = Inter({ weight: '700', subsets: ['latin'] });

interface SignupModalProps {
    showSignup: boolean;
    handleSignupClose: () => void;
    openLoginModal: () => void; 
}

const SignupModal: React.FC<SignupModalProps> = ({ showSignup, handleSignupClose, openLoginModal }) => {
    const {
        signupErrorMessage,
        signupSuccessMessage,
        signup
    } = auth();

    const [formData, setFormData] = useState({
        email: '',
        display_name: '',
        username: '',
        password: ''
    });

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
            {showSignup && (
                <div className={styles.modalWrapper} role="dialog" aria-labelledby="signupModalLabel" aria-hidden={!showSignup}>
                    <div className={styles.modalBackdrop} onClick={handleSignupClose}></div>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h5 className={`${styles.modalTitle} ${righteous.className}`} id="signupModalLabel">Signup</h5>
                            <button type="button" className={styles.closeButton} aria-label="Close" onClick={handleSignupClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {signupSuccessMessage ? (
                                <div className={styles.successMessage}>
                                    <p style={{ color: '#06334D', fontSize: '20px' }}>{signupSuccessMessage}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitSignup}>
                                    <div className={`${styles.formGroup} form-group`}>
                                        <input type="email" className={`${styles.formControl} form-control`} id="email" placeholder="Email Address / Phone Number" onChange={handleInputChange} required />
                                    </div>
                                    <div className={`${styles.formGroup} form-group`}>
                                        <input type="text" className={`${styles.formControl} form-control`} id="display_name" placeholder="Display Name" onChange={handleInputChange} required />
                                    </div>
                                    <div className={`${styles.formGroup} form-group`}>
                                        <input type="text" className={`${styles.formControl} form-control`} id="username" placeholder="UserName" onChange={handleInputChange} required />
                                    </div>
                                    <div className={`${styles.formGroup} form-group`}>
                                        <input type="password" className={`${styles.formControl} form-control`} id="password" placeholder="Password" onChange={handleInputChange} required />
                                    </div>
                                    <div className={styles.signup}>
                                        <button type="submit" className={`${styles.signupButton} btn`}>Signup</button>
                                    </div>
                                    {signupErrorMessage && <p style={{ color: 'red' }}>{signupErrorMessage}</p>}
                                </form>
                            )}
                            <div className={styles.BarImage}>
                                <Image src="/images/or.png" alt="Divider" layout="responsive" width={80} height={30} objectFit="cover" className={styles.or} />
                            </div>
                            <div className={styles.signup}>
                                <button type="button" className={`${styles.Alreadyaccount} btn`} onClick={openLoginModal}>
                                    Already have an account? <span className={styles.loginText}>Login</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SignupModal;
