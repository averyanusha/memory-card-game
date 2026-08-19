import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { VerifyEmailContext, BannerContext, UserContext } from './layouts/RootLayout';
const API_URL = import.meta.env.VITE_APP_URL;

export default function Banner () {
  const emailVerify = useContext(VerifyEmailContext);
  const user = useContext(UserContext);
  const bannerOpen = useContext(BannerContext);
  if (!emailVerify) throw new Error('No verified email');

  const banner: Variants = {
    hidden: {
      y: '-100vh',
      opacity: 0
    },
    visible: {
      y: '20px',
      transition: {
        delay: 0.3, 
        type: 'tween', 
        stiffness: 170
      }
    }
  }

  async function verifyEmail() {
    const token = localStorage.getItem('sign in token');
    if (!token) {
      return;
    }
    try { 
        const response = await fetch(`${API_URL}/reconfirm-email`, {
          method: 'POST',
          headers: {
            'Content-type' : 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        const data = await response.json();
        if(response.ok) {
        }
      } catch (error) {
        console.log(error);
    }
  }

  return (
    <motion.div className="container banner" variants={banner} animate='visible' initial='hidden' exit='hidden'>
      <p className="banner-text">Email is not verified, click{' '}
        <button className="banner-link" onClick={verifyEmail}>here</button>
         {' '}to resend verification link
      </p>
      <button className="banner-close" onClick={() => bannerOpen?.setBannerOpen(false)}>X</button>
    </motion.div>
  )
}