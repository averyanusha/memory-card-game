import { motion, type Variants } from "framer-motion";
import { useState, useContext, useRef } from "react";
import { GameContext } from "../contexts/GameState";
import DisplayCards from "../DisplayCards";

export default function Game({setGameOver, handleClickedCards}: {
  setGameOver: (value: boolean) => void,
  handleClickedCards: (id: number) => void}){
  const game = useContext(GameContext);
  if (!game) throw new Error('CardContext used outside its provider');
  const { displayCards, setDisplayCards, clickedId, resetCards } = game;
  const [flip, setFlip] = useState<boolean>(true);
  const timeout = useRef<number | null>(null);

  return (
    <div className='game'>
      {(displayCards.length > 0) && (clickedId.length != displayCards.length) && (
        <motion.h3 className='score' initial={{opacity: 0}} animate={{opacity: 1}}>
          {clickedId.length}/{displayCards.length}
        </motion.h3>
      )}
      {(clickedId.length === displayCards.length) ? ( 
        <motion.div className='win' initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.5, type: 'spring', stiffness: 50}}>
          <motion.h3 className='game-title'>You win</motion.h3>
          <button className='game-button' onClick={() => {
            setGameOver(false)
            resetCards();
            setDisplayCards([]);
            }}>
              Start Over
          </button>
          <button className="game-button">Choose a new theme</button>
        </motion.div>)
      :
      <DisplayCards flip={flip} setFlip={setFlip} timeout={timeout} handleClickedCards={handleClickedCards}/>
      }
    </div>
  )
}