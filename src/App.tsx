import { useState, useRef  } from 'react'
import { CardsDb } from './components/CardDatabase';
import { motion } from 'motion/react';
import DisplayCards from './components/DisplayCards'
import './App.css'

function App() {

  const [idArray, setIdArray] = useState<number[]>(CardsDb.map((card) => card.id));

  const [clickedId, setClickedId] = useState<number[]>([]);

  const [displayCards, setDisplayCards] = useState<number[]>([]);

  const [gameOver, setGameOver] = useState<boolean>(false);

  const [flip, setFlip] = useState<boolean>(true);

  const [win, setWin] = useState<boolean>(false);

  const timeout = useRef<number | null>(null)

  const handleClickedCards = (id: number) => {
    const stored = localStorage.getItem('ids');
    let savedIds: number[];
    savedIds = stored ? JSON.parse(stored) : [];
    if (!savedIds.find((el) => el === id)) {
      savedIds.push(id);
      setClickedId(savedIds);
      localStorage.setItem('ids', JSON.stringify(savedIds));
      setDisplayCards(shuffle(displayCards));
    } else {
      setGameOver(true);
    }
  }

  const resetClickedCards = () => {
    setClickedId([]);
    localStorage.setItem('ids', JSON.stringify([]));
    timeout.current && clearTimeout(timeout.current);
  }


  // Fisher-Yates shuffle algorithm 

  function shuffle(array: number[]) : number[]{
    for (let i = array.length - 1; i > 0; i --) {
      const random: number = Math.floor(Math.random() * (i + 1));
      [array[i], array[random]] = [array[random], array[i]];
    }
    return array;
  }


  return (
    <>
      <div className='container hero'>
        {displayCards.length === 0 ? <motion.div className="level">
          <motion.h2 animate={{ fontSize: '50px', color: '#ffdf99' }}>Choose your level</motion.h2>
          <button className='game-button' onClick={() => {setDisplayCards(idArray.slice(0,5))}}>Easy</button>
          <button className='game-button' onClick={() => {setDisplayCards(idArray.slice(0, 10))}}>Medium</button>
          <button className='game-button' onClick={() => {setDisplayCards(idArray)}}>Hard</button>
        </motion.div> : 
        gameOver ? 
          <div className='gameover'>
          <h2 className='game-title'>Gameover</h2>
          <p className='game-subtitle'>You lose!</p>
          <button className='game-button' onClick={() => {
            setGameOver(false)
            resetClickedCards()
            setDisplayCards([]);
            }}>
              Start Over
          </button>
          </div> : 
          <div className='game'>
            {(displayCards.length > 0) && (
              <motion.h3 className='score' initial={{opacity: 0}} animate={{opacity: 1}}>
                {clickedId.length}/{displayCards.length}
              </motion.h3>
            )}
            {(clickedId.length === displayCards.length) ?  
              <motion.div className='win' initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1, type: 'spring', stiffness: 50}}>
                <motion.h3 className='game-title'>You win</motion.h3>
                <button className='game-button' onClick={() => {
                  setGameOver(false)
                  resetClickedCards()
                  setDisplayCards([]);
                  }}>
                    Start Over
                </button>
              </motion.div>
            :
            <DisplayCards displayCards={displayCards} flip={flip} setFlip={setFlip} timeout={timeout} handleClickedCards={handleClickedCards}/>
            }
          </div>
        }
      </div>
    </>
  )
}

export default App
