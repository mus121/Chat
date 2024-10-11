'use client'
import Head from "next/head";
import Header from '../components/Header';
import styles from '../styles/scss/landing.module.scss';
import Image from 'next/image';
import { Righteous, Roboto, Inter } from 'next/font/google';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
// import {cook} from './actions';


const righteous = Righteous({ weight: '400', subsets: ['latin'] });
const roboto = Roboto({ weight: '400', subsets: ['latin'] });
const inter = Inter({ weight: '700', subsets: ['latin'] });

const LandingPage = () => {
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [formData, setFormData] = useState({ email: '', display_name: '', username: '', password: '' });
    const [loginFormData, setLoginFormData] = useState({ email: '', password: '' });
    const router = useRouter();

    const {
        signupErrorMessage,
        loginErrorMessage,
        signupSuccessMessage,
        handleSignup,
        handleLogin,
    } = useAuth();

    const handleSignupClose = () => setShowSignup(false);
    const handleLoginClose = () => setShowLogin(false);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setLoginFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmitSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleSignup(formData);
        if (!signupErrorMessage) {
            setShowSignup(true);
        }
    };

    const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isLoggedIn = await handleLogin(loginFormData);
        if (isLoggedIn) {
            router.push('/dashboards');
        }
    };
//    console.log( cook())

    return (
        <div className={styles.container}>
            <Head>
                <title>Pulse - Communicate Anywhere Anytime</title>
                <meta name="description" content="Connect effortlessly across all devices with Pulse." />
            </Head>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xxl-6 col-xl-6 col-md-12 col-sm-12 col-12">
                                <div className={styles.top}>
                                    <div className={styles.community}>
                                        <h1 className={`${styles.heading} ${righteous.className}`}>
                                            Communicate, Anywhere, Anytime
                                        </h1>
                                    </div>
                                    <p className={`${styles.paragraph} ${roboto.className}`}>
                                        Connect effortlessly across all devices with Pulse. Break free from limitations and redefine communication, anytime, anywhere.
                                    </p>
                                    <div className={`${styles.button} d-flex`}>
                                        <div className={styles.signupMain}>
                                            <button type="button" onClick={() => setShowSignup(true)} className={`${inter.className} btn`}
                                                 style={{ backgroundColor: '#06334D', color: '#E6EEF2', padding: '8px 45px', borderRadius: '5px'}}
                                                 >Signup</button>
                                        </div>
                                        <div className={`${styles.loginMain} mx-4`}>
                                            <button type="button" onClick={() => setShowLogin(true)} className={` ${inter.className} btn `}
                                                 style={{ backgroundColor: '#E6EEF2', color: '#06334D', padding: '8px 45px', borderRadius: '5px', border: '1px solid #06334D'}}>Login</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-md-12 col-sm-12 col-12">
                                <div className={styles.imageContainer}>
                                    <Image src="/images/group.png" alt="Pulse Logo" layout="responsive" width={100} height={30} objectFit="cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Signup Modal */}
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
                                {signupSuccessMessage ? ( // Check for success message
                                    <div className={styles.successMessage}>
                                        <p style={{ color: 'green' }}>{signupSuccessMessage}</p>
                                        <button type="button" onClick={handleSignupClose} className="btn">Close</button>
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
                                    <button type="button" className={`${styles.Alreadyaccount} btn `}>Already have an account? <span className={styles.loginText}>Login</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Login Modal */}
                {
                    showLogin && (
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
                                            <input type="text" className={`${styles.formControl} form-control`} id="email" placeholder="Username"  onChange={handleLoginInputChange} required
                                            />
                                        </div>
                                        <div className={`${styles.formGroup} form-group`}>
                                            <input type="password" className={`${styles.formControl} form-control`} id="password" placeholder="Password" onChange={handleLoginInputChange} required
                                            />
                                        </div>
                                        <div className={styles.login}>
                                            <button type="submit" className={`${styles.loginButton} btn `}>Login</button>
                                        </div>
                                        {loginErrorMessage && <p style={{ color: 'red' }}>{loginErrorMessage}</p>}
                                    </form>
                                    <div className={styles.BarImage}>
                                        <Image src="/images/or.png" alt="Pulse Logo" layout="responsive" width={80} height={30} objectFit="cover" className={styles.or} />
                                    </div>
                                    <div className={styles.signup}>
                                        <button type="button" className={`${styles.Alreadyaccount} btn `}>Don't have an account? <span className={styles.loginText}>Signup</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </main >
        </div >
    );
};

export default LandingPage;
