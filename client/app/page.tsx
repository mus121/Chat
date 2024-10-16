import Head from "next/head";
import Header from './components/Header';
import styles from '../styles/scss/landing.module.scss';
import Image from 'next/image';
import { Righteous, Roboto, Inter } from 'next/font/google';
import SignupButton from "./components/SIgnup/SignupButton";
import LoginButton from "./components/LoginComponent/LoginButton";

const righteous = Righteous({ weight: '400', subsets: ['latin'] });
const roboto = Roboto({ weight: '400', subsets: ['latin'] });
const inter = Inter({ weight: '700', subsets: ['latin'] });

const LandingPage = () => {
    return (
        <>
            <div className={styles.container}>
                <Head>
                    <title>Pulse - Communicate Anywhere Anytime</title>
                    <meta name="description" content="Connect effortlessly across all devices with Pulse." />
                </Head>
                <Header />
                <main className={styles.main}>
                    <section className={styles.hero}>
                        <div className="container-fluid">
                            <div className={styles.landingSection}>
                                <div className="">
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
                                                <SignupButton />
                                            </div>
                                            <div className={`${styles.loginMain}`}>
                                                <LoginButton/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className={styles.imageContainer}>
                                        <Image src="/images/group.png" alt="Pulse Logo" layout="responsive" width={100} height={30} objectFit="cover" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
export default LandingPage;