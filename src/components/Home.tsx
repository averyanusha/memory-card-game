import { useRef, useState, useEffect, useContext, createContext } from "react";
import { CardsDb } from "./CardDatabase";
import { motion } from 'framer-motion';
import DisplayCards from "./DisplayCards";
import { ModalContext, GameContext } from "./layouts/RootLayout";
const API_URL = 'http://localhost:3000'

export default function Home() {
  const modal = useContext(ModalContext);
  const [idArray, setIdArray] = useState<number[]>(CardsDb.map((card) => card.id));
  const [level, setLevel] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [flip, setFlip] = useState<boolean>(true);
  const timeout = useRef<number | null>(null);
  const cards = useContext(GameContext);
  if (!cards) throw new Error('CardContext used outside its provider');
  const {displayCards, setDisplayCards, clickedId, setClickedId} = cards;

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
        modal?.setShowModal(true);
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

  const handleClickedCards = (id: number) => {
    const stored = localStorage.getItem('ids');
    let savedIds: number[];
    savedIds = stored ? JSON.parse(stored) : [];
    if (!savedIds.find((el) => el === id)) {
      savedIds.push(id);
      setClickedId(savedIds);
      localStorage.setItem('ids', JSON.stringify(savedIds));
      shuffleSlice(displayCards.length);
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

  const shuffleSlice = (difficulty: number) => {
    setDisplayCards(shuffle(idArray).slice(0, difficulty));
  }

  return (
    <div className='container hero'>
      {displayCards.length === 0 ? <motion.div className='level' initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.5}}>
        <motion.h2 animate={{ fontSize: '50px', color: '#ffdf99' }}>Choose your level</motion.h2>
        <button className='game-button' onClick={() => {
          setLevel('easy');
          shuffleSlice(5);
          }}>Easy</button>
        <button className='game-button' onClick={() => {
          setLevel('medium');
          shuffleSlice(10);
          }}>Medium</button>
        <button className='game-button' onClick={() => {
          setLevel('hard')
          setDisplayCards(idArray)
          }}>Hard</button>
      </motion.div> : 
      gameOver ? (
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
        </div> ): 
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
                resetClickedCards()
                setDisplayCards([]);
                }}>
                  Start Over
              </button>
            </motion.div>)
          :
          <DisplayCards flip={flip} setFlip={setFlip} timeout={timeout} handleClickedCards={handleClickedCards}/>
          }
        </div>
      }
    </div>
  )
}