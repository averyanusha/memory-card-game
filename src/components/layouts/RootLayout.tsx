import { Outlet, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Modal from '../Modal';
import type { Card } from '../CardDatabase';
import LoadingPage from '../pages/LoadingPage';
import Banner from '../Banner';
import { useEffect, useState, createContext } from 'react';
import { GameContextProvider } from '../contexts/GameState';
import { CardSetContext, VerifyEmailContext, AuthContext, UserContext, BannerContext, ModalContext } from '../contexts/Contexts';
const API_URL = import.meta.env.VITE_API_URL;


export default function RootLayout(){
  const [ showModal, setShowModal ] = useState<boolean>(false);
  const [ isLoggedIn, setIsLoggedIn ] = useState<boolean>(false);
  const [ username, setUserName ] = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ bannerOpen, setBannerOpen ] = useState<boolean>(true);
  const [ emailVerified, setEmailVerified ] = useState<boolean>(false);
  const [ cardDeck, setCardDeck ] = useState<Card[]>([]);

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
          setEmailVerified(data.verified);
          data.verified && setBannerOpen(false);
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

  console.log('banner check:', isLoggedIn, emailVerified, bannerOpen);

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      <UserContext.Provider value={{username, setUserName}}>
        <ModalContext.Provider value={{showModal, setShowModal}}>
          <CardSetContext.Provider value={{cardDeck, setCardDeck}}>
            <GameContextProvider>
              <VerifyEmailContext.Provider value={{emailVerified, setEmailVerified}}>
                <BannerContext.Provider value={{bannerOpen, setBannerOpen}}>
                  <Navbar/>
                  {isLoggedIn && !emailVerified && bannerOpen && <Banner />}
                  <Outlet />
                  {showModal && <Modal />}
                </BannerContext.Provider>
              </VerifyEmailContext.Provider>
            </GameContextProvider>
          </CardSetContext.Provider>
        </ModalContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
  )
}