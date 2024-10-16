// components/LoginModal.tsx
import styles from '../../../styles/scss/landing.module.scss';
import { Righteous, Inter } from 'next/font/google';
import Image from 'next/image';
import { ChangeEvent, FormEvent } from 'react';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });
const inter = Inter({ weight: '700', subsets: ['latin'] });

interface LoginModalProps {
    showLogin: boolean;
    handleLoginClose: () => void;
    handleLoginInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmitLogin: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    loginErrorMessage: string | null;
}

const LoginModal: React.FC<LoginModalProps> = ({ showLogin, handleLoginClose, handleLoginInputChange, handleSubmitLogin, loginErrorMessage }) => {
    return (
        <>
            {showLogin && (
                <div className={styles.modalWrapper} role="dialog" aria-labelledby="loginModalLabel" aria-hidden={!showLogin}>
                    <div className={styles.modalBackdrop} onClick={handleLoginClose}></div>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h5 className={`${styles.modalTitle} ${righteous.className}`} id="loginModalLabel">Login</h5>
                            <button type="button" className={styles.closeButton} aria-label="Close" onClick={handleLoginClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <form onSubmit={handleSubmitLogin}>
                                <div className={`${styles.formGroup} form-group`}>
                                    <input type="text" className={`${styles.formControl} form-control`} id="email" placeholder="Username" onChange={handleLoginInputChange} required />
                                </div>
                                <div className={`${styles.formGroup} form-group`}>
                                    <input type="password" className={`${styles.formControl} form-control`} id="password" placeholder="Password" onChange={handleLoginInputChange} required />
                                </div>
                                <div className={styles.login}>
                                    <button type="submit" className={`${styles.loginButton} btn`}>Login</button>
                                </div>
                                {loginErrorMessage && <p style={{ color: 'red' }}>{loginErrorMessage}</p>}
                            </form>
                            <div className={styles.BarImage}>
                                <Image src="/images/or.png" alt="Divider" layout="responsive" width={80} height={30} objectFit="cover" className={styles.or} />
                            </div>
                            <div className={styles.signup}>
                                <button type="button" className={`${styles.Alreadyaccount} btn`} onClick={handleLoginClose}>Don't have an account? <span className={styles.loginText}>Signup</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default LoginModal;
