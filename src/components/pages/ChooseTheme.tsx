import { useContext, useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { CardSetContext } from "../contexts/Contexts";
import { GameContext } from "../contexts/GameState";
import type {Card} from '../CardDatabase';
import Submitting from "./Submitting";
const API_URL = "http://localhost:3000";

export default function ChooseTheme({ submitting, setSubmitting } : {
  submitting: boolean,
  setSubmitting: (value : boolean) => void}) {
  const cardSet = useContext(CardSetContext);
  if (!cardSet)
    throw new Error('CardSetContext used outside its provider');
  const {cardDeck, setCardDeck} = cardSet;

  const game = useContext(GameContext);
  if(!game)
    throw new Error('GameContext used outside its provider');
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


  type ApiCard = {
    name: string,
    imagePrompt: string
  }

  interface GeneratedCards extends ApiCard {
    imageUrl: string
  }

  async function fetchTheme(selectedTheme: string) {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/generate-cards`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ theme: selectedTheme })
      });
      if (response.ok) {
        const data: { cards: ApiCard[] } = await response.json();
        setCardDeck(
          data.cards.map((card, i: number) => ({
            id: i + 1,
            name: card.name,
            image: ""
          }))
        )
        game?.setTheme(selectedTheme);
        try {
          console.log(`Generating images, theme for ${selectedTheme}`)
          const imageResponse = await fetch(`${API_URL}/generate-images`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ theme: selectedTheme })
          });
          if (imageResponse.ok) {
            const data: { cards: GeneratedCards[] } = await imageResponse.json();
            console.log("data:", data);
            setCardDeck(data.cards.map((card, i: number) => ({
              id: i + 1,
              name: card.name,
              image: card.imageUrl
            })))
          } else {
            throw new Error(`Something went wrong at image generation for ${selectedTheme}`)
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
  })

  function handleThemeRequest(event: React.SubmitEvent){
    event.preventDefault();
    const themeInput = event.target.elements.namedItem('theme') as HTMLInputElement;
    fetchTheme(themeInput.value);
  }

  return (
    <>
      {submitting && <Submitting /> }
      <motion.div className="container" variants={themeMotion} animate='visible' initial='hidden'>
        <motion.h1 className="game-subtitle">Choose your theme</motion.h1>
        <motion.p className="game-title">Make me a deck of...</motion.p>
        <form className="theme" onSubmit={handleThemeRequest}>
          <motion.input type="text" name="theme" className="input theme-input" placeholder='sushi'/>
          <button type="submit" className="theme-button game-button"></button>
        </form>
        <h2>or try one</h2>
        <button className="game-button" onClick={() => {fetchTheme('geometric')}}>Geometric</button>
        <button className="game-button" onClick={() => {fetchTheme('deep sea')}}>Deep Sea</button>
        <button className="game-button" onClick={() => {fetchTheme('princesses')}}>Princesses</button>
        <button className="game-button" onClick={() => {fetchTheme('cats in hats')}}>Cats in hats</button>
      </motion.div>
    </>
  )
}