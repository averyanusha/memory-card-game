import { Outlet, Link } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Modal from '../Modal';
import LoadingPage from '../pages/LoadingPage';
import { useEffect, useState, createContext } from 'react';
const API_URL = import.meta.env.VITE_API_URL;

type Auth = {
  isLoggedIn: boolean,
  setIsLoggedIn: (value: boolean) => void
}

type User = {
  username: string,
  setUserName: (value: string) => void
}

type Modal = {
  showModal: boolean,
  setShowModal: (value: boolean) => void
}

type GameState = {
  displayCards: number[],
  setDisplayCards: (value: number[]) => void,
  clickedId: number[],
  setClickedId: (value: number[]) => void,
  resetCards: () => void
}

export const GameContext = createContext<GameState | null>(null);
export const AuthContext = createContext<Auth | null >(null);
export const UserContext = createContext<User | null >(null);
export const ModalContext = createContext<Modal | null >(null);

function GameStateProvider({children} : { children: React.ReactNode }) {
  const [displayCards, setDisplayCards] = useState<number[]>([]);
  const [clickedId, setClickedId] = useState<number[]>([]);

  const resetCards = () => {
    localStorage.setItem('ids', JSON.stringify([]));
    setDisplayCards([]);
    setClickedId([]);
  }

  return (
    <GameContext.Provider value={{ displayCards, setDisplayCards, clickedId, setClickedId, resetCards}}>{children}</GameContext.Provider>
  )
}

export default function RootLayout(){
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {

    const checkIfTokenExists = async () => {
      const token = localStorage.getItem('sign in token');
      if (!token) {
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
      return;
      }

      try { 
        const response = await fetch(`${API_URL}/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json();
        if(response.ok) {
          setIsLoggedIn(true);
          setUserName(data.username);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    checkIfTokenExists();
  }, [])

  if (isLoading)
    return <LoadingPage />

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      <UserContext.Provider value={{username, setUserName}}>
        <ModalContext.Provider value={{showModal, setShowModal}}>
          <GameStateProvider>
            <Navbar/>
            <Outlet />
            {showModal && <Modal />}
          </GameStateProvider>
        </ModalContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
  )
}