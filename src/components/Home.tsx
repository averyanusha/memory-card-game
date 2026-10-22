import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "./contexts/GameState";
import { ModalContext, CardSetContext } from "./contexts/Contexts";
import LevelSelect from "./pages/LevelSelect";
import ChooseTheme from "./pages/ChooseTheme";
import LoadingPage from "./pages/LoadingPage";
import Game from "./pages/Game";
const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const navigate = useNavigate();
  const modal = useContext(ModalContext);
  const game = useContext(GameContext);
  const cards = useContext(CardSetContext);
  if (!game) throw new Error('CardContext used outside its provider');
  const { displayCards, setDisplayCards, clickedId, resetCards, handleClickedCards, startGame, level, theme, isGenerating, gameStatus } = game;
  useEffect(() => {
    const saveResultInDb= async() => {
      if (gameStatus === 'playing')
        return;
      console.log('SAVING', clickedId.length);
      const token = localStorage.getItem('sign in token');
      const score = clickedId.length;
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
        body: JSON.stringify({score, gameStatus, level})
      })

      const data = await response.json();

      if(response.ok) {
        localStorage.removeItem('score');
      }
    }
    saveResultInDb();
  }, [clickedId, gameStatus]);
console.log("isGenerating:", isGenerating, "deck:", cards?.cardDeck[0]?.image);

  return (
    <div className='container hero'>
      {!theme ? <ChooseTheme /> : displayCards.length === 0 ? <LevelSelect/> : isGenerating ? <LoadingPage /> : <Game/>}
    </div>
  )
}