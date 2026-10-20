import { useState, createContext, useContext } from "react";
import { CardSetContext } from "./Contexts";

type GameStatus = 'playing' | 'won' | 'lost'

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
  level: string,
  setLevel: (value: string) => void
  theme: string,
  setTheme: (value: string) => void,
  isGenerating: boolean,
  setIsGenerating: (value: boolean) => void,
  gameStatus: GameStatus,
  setGameStatus: (value: GameStatus) => void
}


export const GameContext = createContext<GameState | null>(null);

export function GameContextProvider({children} : { children: React.ReactNode }) {
  const [displayCards, setDisplayCards] = useState<number[]>([]);
  const [clickedId, setClickedId] = useState<number[]>([]);
  const [level, setLevel] = useState<string>('');
  const cardSet = useContext(CardSetContext);
  if (!cardSet) throw new Error('CardSet context is outsode its provider');
  const { cardDeck, setCardDeck } = cardSet;
  const idArray = (cardDeck.map((card) => card.id));
  const [ theme, setTheme] = useState<string>('');
  const [ isGenerating, setIsGenerating ] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');

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
      } else if (clickedId.length === displayCards.length) {
        setGameStatus('won')
      } else {
        setGameStatus('lost');
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
      console.log("shuffled:", shuffle([...idArray]).slice(0, difficulty));
      setDisplayCards(shuffle([...idArray]).slice(0, difficulty));
    }

  return (
    <GameContext.Provider value={{ displayCards, setDisplayCards, clickedId, setClickedId, resetCards, handleClickedCards, startGame, shuffle, shuffleSlice, gameStatus, setGameStatus, level, setLevel, theme, setTheme, isGenerating, setIsGenerating}}>{children}</GameContext.Provider>
  )
}