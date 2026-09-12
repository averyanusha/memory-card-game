import { useState, createContext, useContext } from "react";
import { CardSetContext } from "./Contexts";

type GameState = {
  displayCards: number[],
  setDisplayCards: (value: number[]) => void,
  clickedId: number[],
  setClickedId: (value: number[]) => void,
  resetCards: () => void,
  handleClickedCards: (id: number) => void,
  startGame: (level: string, count: number) => void,
  shuffle: (array: number[]) => number[],
  shuffleSlice: (difficulty: number) => void,
  gameOver: boolean,
  setGameOver: (value: boolean) => void,
  level: string,
  setLevel: (value: string) => void
}


export const GameContext = createContext<GameState | null>(null);

export function GameContextProvider({children} : { children: React.ReactNode }) {
  const [displayCards, setDisplayCards] = useState<number[]>([]);
  const [clickedId, setClickedId] = useState<number[]>([]);
  const [level, setLevel] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);  
  const cardSet = useContext(CardSetContext);
  if (!cardSet) throw new Error('CardSet context is outsode its provider');
  const { cardDeck, setCardDeck } = cardSet;
  const idArray = (cardDeck.map((card) => card.id));

  const resetCards = () => {
    localStorage.setItem('ids', JSON.stringify([]));
    setDisplayCards([]);
    setClickedId([]);
  }

    const handleClickedCards = (id: number) => {
      const stored = localStorage.getItem('ids');
      let savedIds: number[];
      savedIds = stored ? JSON.parse(stored) : [];
      if (!savedIds.find((el) => el === id)) {
        savedIds.push(id);
        localStorage.setItem('ids', JSON.stringify(savedIds));
        setClickedId(savedIds);
        shuffleSlice(displayCards.length);
      } else {
        setGameOver(true);
      }
  }

    const startGame = (level: string, count: number) => {
      localStorage.setItem('ids', JSON.stringify([]));
      setLevel(level);
      shuffleSlice(count);
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
      setDisplayCards(shuffle([...idArray]).slice(0, difficulty));
    }

  return (
    <GameContext.Provider value={{ displayCards, setDisplayCards, clickedId, setClickedId, resetCards, handleClickedCards, startGame, shuffle, shuffleSlice, gameOver, setGameOver, level, setLevel}}>{children}</GameContext.Provider>
  )
}