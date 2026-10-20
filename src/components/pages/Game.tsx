import { motion, type Variants } from "framer-motion";
import { useState, useContext, useRef } from "react";
import { GameContext } from "../contexts/GameState";
import { CardSetContext } from "../contexts/Contexts";
import DisplayCards from "../DisplayCards";

export default function Game(){
  const game = useContext(GameContext);
  if (!game) throw new Error('GameContext used outside its provider');
  const cards = useContext(CardSetContext);
  if(!cards) throw new Error('CardContext is outside its provider');
  const { displayCards, setDisplayCards, clickedId, resetCards, gameStatus, setTheme, setGameStatus } = game;
  const [flip, setFlip] = useState<boolean>(true);
  const timeout = useRef<number | null>(null);

  return (
    <div className='game'>
      {(displayCards.length > 0) && (clickedId.length != displayCards.length) && (
        <motion.h3 className='score' initial={{opacity: 0}} animate={{opacity: 1}}>
          {clickedId.length}/{displayCards.length}
        </motion.h3>
      )}
      {gameStatus === 'playing' ? 
        <DisplayCards flip={flip} setFlip={setFlip} timeout={timeout}/> :
        <motion.div className='win' initial={{opacity: 0}} animate={{opacity: 1}}transition={{delay: 0.5, type: 'spring', stiffness: 50}}>
          <motion.h3 className='game-title'>{`You ${gameStatus}`}</motion.h3>
          <button className='game-button' onClick={() => {
            resetCards();
            setDisplayCards([]);
            }}>
              Start Over
          </button>
          <button className="game-button" onClick={() => {setTheme(''), cards.setCardDeck([]), setDisplayCards([]), setGameStatus('playing')}}>Choose a new theme</button>
        </motion.div>
      }
    </div>
  )
}