import { useState, createContext, useContext } from "react";
import { CardSetContext } from "./Contexts";
import type { ErrorStatus } from "../../types";
const API_URL = "http://localhost:3000";

type GameStatus = 'playing' | 'won' | 'lost';

type JobStatus = {
  status: 'waiting' | 'active' | 'completed' | 'failed';
  cards?: GeneratedCards[];
  code?: ErrorStatus;
}

type GameState = {
  displayCards: number[],
  setDisplayCards: (value: number[]) => void,
  clickedId: number[],
  setClickedId: (value: number[]) => void,
  resetCards: () => void,
  chooseNewTheme: () => void,
  fetchTheme: (selectedTheme: string) => Promise<void>,
  handleClickedCards: (id: number) => void,
  startGame: (level: string, count: number) => void,
  shuffle: (array: number[]) => number[],
  shuffleSlice: (difficulty: number) => void,
  level: string,
  setLevel: (value: string) => void
  theme: string,
  setTheme: (value: string) => void,
  imagesSet: boolean,
  gameStatus: GameStatus,
  setGameStatus: (value: GameStatus) => void,
  isError: ErrorStatus | null,
  setIsError: (value: ErrorStatus | null) => void,
  isSubmitting: boolean,
  setIsSubmitting: (value: boolean) => void
}

type ApiCard = {
  name: string,
  imagePrompt: string
}

interface GeneratedCards extends ApiCard {
  imageUrl: string
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
  const imagesSet = cardDeck.every(el => el.image === '');
  const [ gameStatus, setGameStatus ] = useState<GameStatus>('playing');
  const [ isError, setIsError ] = useState<ErrorStatus | null>(null);
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

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
      if (savedIds.length === displayCards.length) {
        setGameStatus('won')
      }
    } else {
      setGameStatus('lost');
    }
  }

  const startGame = (level: string, count: number) => {
    localStorage.setItem('ids', JSON.stringify([]));
    setLevel(level);
    shuffleSlice(count);
  }

  const chooseNewTheme = () => {
    resetCards();
    setTheme('');
    setCardDeck([]);
    setGameStatus('playing');
  }

  async function fetchTheme(selectedTheme: string) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/generate-cards`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ theme: selectedTheme })
      });
      if (response.ok) {
        const data: { cards: ApiCard[] } = await response.json();
        setCardDeck(
          data.cards.map((card, i: number) => ({
            id: i + 1,
            name: card.name,
            image: ""
          }))
        )
        setTheme(selectedTheme);
        imageJob(selectedTheme);
      } else {
        const data = await response.json();
        console.log("setting error:", data.code);
        setIsError(data.code ?? 'GENERATION_FAILED');
      }
    } catch (error) {
      console.error(error);
      setIsError('NETWORK');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function imageJob(selectedTheme: string) {
    try {
      console.log(`Generating images, theme for ${selectedTheme}`)
      const response = await fetch(`${API_URL}/generate-images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ theme: selectedTheme })
      });
      if (response.ok) {
        const data = await response.json();
        console.log(`Job ID is ${data.jobId}`);
        if (data.jobId)
          polljob(data.jobId)
        else if (data.cards) {
          updateCardDeck(data.cards);
        }
      } else {
        const data = await response.json();
        setIsError(data.code ?? 'GENERATION_FAILED');
        console.log("setting error to:", data.code);
        return;
      }
    } catch (error) {
      console.error(error);
      setIsError('NETWORK');
    }
  }

  function sleeper (timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  async function polljob(id: number){
    try {
      const response = await fetch(`${API_URL}/job/${id}`);
      if (response.ok) {
        const jobResponse: JobStatus = await response.json();
        while (true) {
          if (jobResponse.status === 'completed' && jobResponse.cards) {
            updateCardDeck(jobResponse.cards);
            return;
          }
          if (jobResponse.status === 'failed' && jobResponse.code) {
            setIsError(jobResponse.code);
            return;
          }
          await sleeper(2000);
        }
      }
    } catch(error) {
      console.error(error);
      setIsError('JOB_NOT_FOUND');
    }
  }

  function updateCardDeck(cards: GeneratedCards[]) {
    setCardDeck(cards.map((card, i: number) => ({
      id: i + 1,
      name: card.name,
      image: card.imageUrl
    })))
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
    <GameContext.Provider value={{ displayCards, setDisplayCards, clickedId, setClickedId, resetCards, handleClickedCards, startGame, shuffle, shuffleSlice, gameStatus, setGameStatus, level, setLevel, theme, setTheme, imagesSet, chooseNewTheme, fetchTheme, isError, setIsError, isSubmitting, setIsSubmitting}}>{children}</GameContext.Provider>
  )
}