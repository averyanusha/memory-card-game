import { useContext, useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { GameContext } from "../contexts/GameState";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import magicWand from '../../assets/magic_wand.png'

export default function ChooseTheme() {
  const game = useContext(GameContext);
  if(!game)
    throw new Error('GameContext used outside its provider');
  const {isError, setIsError, fetchTheme, isSubmitting} = game;
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
  };


  function handleThemeRequest(event: React.SubmitEvent){
    event.preventDefault();
    const themeInput = event.target.elements.namedItem('theme') as HTMLInputElement;
    fetchTheme(themeInput.value);
  }


  return (
    <>
      {isSubmitting && <LoadingPage /> }
      <motion.div className="container theme" variants={themeMotion} animate='visible' initial='hidden'>
        <div className="theme-image">
          <img src={magicWand} alt="magic-wand"/>
        </div>
        <div className="">
          <motion.h1 className="game-subtitle">Choose your theme</motion.h1>
          <motion.p className="game-title">Make me a deck of...</motion.p>
          <form className="theme-form" onSubmit={handleThemeRequest}>
            <motion.input type="text" name="theme" className="input theme-input" placeholder='sushi'/>
            <button type="submit" className="theme-button game-button"></button>
          </form>
          <h2>or try one</h2>
          <button className="game-button" onClick={() => {fetchTheme('geometric')}}>Geometric</button>
          <button className="game-button" onClick={() => {fetchTheme('deep sea')}}>Deep Sea</button>
          <button className="game-button" onClick={() => {fetchTheme('princesses')}}>Princesses</button>
          <button className="game-button" onClick={() => {fetchTheme('cats in hats')}}>Cats in hats</button>
        </div>
      </motion.div>
    </>
  )
}