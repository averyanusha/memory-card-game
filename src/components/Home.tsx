import { useRef, useState, useEffect, useContext } from "react";
import { motion } from 'framer-motion';
import { GameContext } from "./contexts/GameState";
import { ModalContext } from "./contexts/Contexts";
import LevelSelect from "./pages/LevelSelect";
import ChooseTheme from "./pages/ChooseTheme";
import Game from "./pages/Game";
const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const modal = useContext(ModalContext);
  const cards = useContext(GameContext);
  if (!cards) throw new Error('CardContext used outside its provider');
  const { displayCards, setDisplayCards, clickedId, resetCards, handleClickedCards, startGame, gameOver, setGameOver, level } = cards;
  const [ theme, setTheme ] = useState<string>('');

  useEffect(() => {
    const saveResultInDb= async() => {
      const isWin = displayCards.length > 0 && clickedId.length === displayCards.length;
      if (!isWin && !gameOver)
        return;
      console.log('SAVING', clickedId.length);
      const token = localStorage.getItem('sign in token');
      const score = clickedId.length;
      const result = gameOver ? 'lose' : 'win';
      if (!token){
        localStorage.setItem('score', JSON.stringify(score));
        setTimeout(() => {
          modal?.setShowModal(true);
        }, 500);
        return;
      }
      const response = await fetch(`${API_URL}/save-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({score, result, level})
      })

      const data = await response.json();

      if(response.ok) {
        localStorage.removeItem('score');
      }
    }
    saveResultInDb();
  }, [clickedId, gameOver]);


  if (!theme)
    return (<ChooseTheme theme={theme} setTheme={setTheme}/>)

  return (
    <div className='container hero'>
      {displayCards.length === 0 ? <LevelSelect startGame={startGame}/> : 
      gameOver ? (
        <div className='gameover'>
        <h2 className='game-title'>Gameover</h2>
        <p className='game-subtitle'>You lose!</p>
        <button className='game-button' onClick={() => {
          setGameOver(false)
          resetCards();
          setDisplayCards([]);
          }}>
            Start Over
        </button>
        <button className="game-button">Choose a new theme</button>
        </div> ): <Game setGameOver={setGameOver} handleClickedCards={handleClickedCards}/>
      }
    </div>
  )
}