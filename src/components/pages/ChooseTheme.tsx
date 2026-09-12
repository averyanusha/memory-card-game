import { useState } from "react";
import { motion, type Variants } from "framer-motion";
const API_URL = import.meta.env.VITE_API_URL;

export default function ChooseTheme({theme, setTheme} : {theme: string, setTheme: (value: string) => void}) {
  const themeMotion: Variants = {
    hidden: {
      y: '-100vh',
      opacity: 0
    },
    visible: {
      y: '100px',
      opacity: 1,
      transition: {
        delay: 0.5,
        type: 'spring', 
        stiffness: 170
      }
    }
  }

  async function handleThemeRequest(event: React.SubmitEvent){
    try {
      event?.preventDefault();
      const response = await fetch(`${API_URL}/generate-cards`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ theme })
      });
      if (response.ok) {}
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    <motion.div className="container" variants={themeMotion} animate='visible' initial='hidden'>
      <motion.h1 className="game-subtitle">Choose your theme</motion.h1>
      <motion.p className="game-title">Type anything you like to generate your theme</motion.p>
      <div className="">
        <motion.input type="text" name="theme" className="theme" placeholder="Rabbits"  onChange={(e) => {setTheme(e.target.value)}}/>
        <button className="theme-button"></button>
      </div>
      <button className="game-button">Geometric</button>
      <button className="game-button">Deep Sea</button>
      <button className="game-button">Princess</button>
      <button className="game-button">Cats in hats</button>
    </motion.div>
    </>
  )
}