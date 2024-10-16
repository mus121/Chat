'use client';
import styles from '../../../styles/scss/landing.module.scss';
import LoginModal from './LoginModal';
import { Righteous, Roboto, Inter } from 'next/font/google';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from "next/navigation";
import { auth } from "../../hooks/auth";

const righteous = Righteous({ weight: '400', subsets: ['latin'] });
const roboto = Roboto({ weight: '400', subsets: ['latin'] });
const inter = Inter({ weight: '700', subsets: ['latin'] });

const LoginButton = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [loginFormData, setLoginFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  const {
    loginErrorMessage,
    login,
  } = auth();

  const handleLoginClose = () => setShowLogin(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await login(loginFormData);
    if (response) {
      router.push('/dashboards');
    }
  };

  return (
    <>

      <div className={`${styles.loginMain} mx-4`}>
        <button type="button" className={`${inter.className} btn `}
          style={{ backgroundColor: '#E6EEF2', color: '#06334D', padding: '8px 45px', borderRadius: '5px', border: '1px solid #06334D' }}
          onClick={() => setShowLogin(true)}>Login</button>
      </div>
      <LoginModal
        showLogin={showLogin}
        handleLoginClose={handleLoginClose}
        handleLoginInputChange={handleLoginInputChange}
        handleSubmitLogin={handleSubmitLogin}
        loginErrorMessage={loginErrorMessage}
      />
    </>
  )
}

export default LoginButton
