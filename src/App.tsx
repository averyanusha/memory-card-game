import { useState } from 'react'
import { CardsDb } from './components/CardDatabase';
import { motion } from 'motion/react';
import './App.css'

function App() {

  const [idArray, setIdArray] = useState<number[]>(CardsDb.map((card) => card.id));

  const [clickedId, setClickedId] = useState<number[]>([]);

  const [displayCards, setDisplayCards] = useState<number[]>([]);

  const [gameOver, setGameOver] = useState<boolean>(false);

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
    localStorage.setItem('ids', JSON.stringify([]))
    setGameOver(false)
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
        {displayCards.length === 0 ? <motion.div className="level" initial={{opacity: 0}} animate={{opacity: 1}}>
          <motion.h2 animate={{ fontSize: '50px', color: '#ffdf99' }}>Choose your level</motion.h2>
          <button className='game-button' onClick={() => {setDisplayCards(idArray.slice(0,5))}}>Easy</button>
          <button className='game-button' onClick={() => {setDisplayCards(idArray.slice(0, 10))}}>Medium</button>
          <button className='game-button' onClick={() => {setDisplayCards(idArray)}}>Hard</button>
        </motion.div> : 
        gameOver ? 
          <div className='gameover'>
          <h2 className='game-title'>Gameover</h2>
          <p>You lose!</p>
          <button className='game-button' onClick={() => {
            resetClickedCards()
            setDisplayCards([]);
            }}>Start Over</button>
          </div> : 
          <motion.div className='cards'>
            {displayCards.map((id) => {
              const card = CardsDb.find(card => card.id === id)
              if (!card)
                return null;
              return (
                <motion.div key={id} className='card' initial={{y: '-100vh'}} animate={{y: 0}} transition={{delay: 0.2}}>
                  <button onClick={() => 
                    handleClickedCards(id)}>
                    <img src={card.image} alt={card.name} className='card-img'/>
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        }
        {(displayCards.length > 0) && (!gameOver) && (
          <motion.h3 className='score' initial={{opacity: 0}} animate={{opacity: 1}}>
            {clickedId.length}/{idArray.length}
          </motion.h3>
        )}
      </div>
    </>
  )
}

export default App
