import { useRef, useState, useEffect, useContext } from "react";
import { GameContext } from "./contexts/GameState";
import { ModalContext, CardSetContext } from "./contexts/Contexts";
import LevelSelect from "./pages/LevelSelect";
import ChooseTheme from "./pages/ChooseTheme";
import LoadingPage from "./pages/LoadingPage";
import Game from "./pages/Game";
const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const modal = useContext(ModalContext);
  const game = useContext(GameContext);
  const cards = useContext(CardSetContext);
  if (!game) throw new Error('CardContext used outside its provider');
  const { displayCards, clickedId, level, theme, isGenerating, gameStatus } = game;
  const [ submitting, setSubmitting ] = useState<boolean>(false);
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

  return (
    <div className='container hero'>
      {!theme ? <ChooseTheme submitting={submitting} setSubmitting={setSubmitting}/> : displayCards.length === 0 ? <LevelSelect setSubmitting={setSubmitting}/> : isGenerating ? <LoadingPage /> : <Game/>}
    </div>
  )
}