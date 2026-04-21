import { useState } from 'react'
import { CardsDb } from './components/CardDatabase';
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
      setIdArray(shuffle(displayCards));
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
        {displayCards.length === 0 ? <div className="level">
          <h2>Choose your level</h2>
          <button onClick={() => {setDisplayCards(idArray.slice(0,5))}}>Easy</button>
          <button onClick={() => {setDisplayCards(idArray.slice(0, 10))}}>Medium</button>
          <button onClick={() => {setDisplayCards(idArray)}}>Hard</button>
        </div> : 
        gameOver ? 
          <div className='gameover'>
          <h2>Gameover</h2>
          <p>You lose!</p>
          <button className='gameover-button' onClick={() => resetClickedCards()}>Start Over</button>
          </div> : 
          <div className='cards'>
            {displayCards.map((id) => {
              const card = CardsDb.find(card => card.id === id)
              if (!card)
                return null;
              return (
                <div key={id} className='card'>
                  <button onClick={() => 
                    handleClickedCards(id)}>
                    <img src={card.image} alt={card.name} className='card-img'/>
                  </button>
                </div>
              )
            })}
          </div>
        }
        <h3 className='score'>{clickedId.length}\{idArray.length}</h3>
      </div>
    </>
  )
}

export default App
