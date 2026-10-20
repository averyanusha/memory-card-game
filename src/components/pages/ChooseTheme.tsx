import { useContext } from "react";
import { motion, type Variants } from "framer-motion";
import { CardSetContext } from "../contexts/Contexts";
import { GameContext } from "../contexts/GameState";
import type {Card} from '../CardDatabase';
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:3000";

export default function ChooseTheme() {
  const cardSet = useContext(CardSetContext);
  const navigate = useNavigate();
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

  async function fetchTheme(selectedTheme: string) {
    game?.setIsGenerating(true);
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
      }
    } catch (error) {
      console.log(error)
    } finally {
      game?.setIsGenerating(false);
    }
  }

    // async function generateCards(prompts: string[]){
    //   try {
    //     const response = await fetch(`${API_URL}/generate-images`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-type': 'application/json'
    //       },
    //       body: JSON.stringify({ prompts })
    //     })
    //     if(response.ok){
    //       const data = await response.json();
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

  function handleThemeRequest(event: React.SubmitEvent){
    event.preventDefault();
    const themeInput = event.target.elements.namedItem('theme') as HTMLInputElement;
    fetchTheme(themeInput.value);
  }

  return (
    <>
    <motion.div className="container" variants={themeMotion} animate='visible' initial='hidden'>
      <motion.h1 className="game-subtitle">Choose your theme</motion.h1>
      <motion.p className="game-title">Type anything you like to generate your theme</motion.p>
      <form className="" onSubmit={handleThemeRequest}>
        <motion.input type="text" name="theme" className="theme" placeholder={game?.theme}/>
        <button type="submit" className="theme-button game-button">=</button>
      </form>
      <button className="game-button" onClick={() => {fetchTheme('geometric')}}>Geometric</button>
      <button className="game-button" onClick={() => {fetchTheme('deep sea')}}>Deep Sea</button>
      <button className="game-button" onClick={() => {fetchTheme('princesses')}}>Princesses</button>
      <button className="game-button" onClick={() => {fetchTheme('cats in hats')}}>Cats in hats</button>
    </motion.div>
    </>
  )
}