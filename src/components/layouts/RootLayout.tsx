import { Outlet, Link } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Modal from '../Modal';
import { useEffect, useState, createContext } from 'react';
const API_URL = 'http://localhost:3000';

type Auth = {
  isLoggedIn: boolean,
  setIsLoggedIn: (value: boolean) => void
}

type User = {
  username: string,
  setUserName: (value: string) => void
}

export const AuthContext = createContext<Auth | null >(null);
export const UserContext = createContext<User | null >(null);


export default function RootLayout(){
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUserName] = useState<string>('')
  useEffect(() => {
    const checkIfTokenExists = async () => {
      const token = localStorage.getItem('sign in token');
      if (!token)
        return;

      const response = await fetch(`${API_URL}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer${token}`
        }
      })
      const data = await response.json();
      if(response.ok) {
        setIsLoggedIn(true);
        setUserName(data.username)
      }
    }
    checkIfTokenExists();
  }, [])
  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      <UserContext.Provider value={{username, setUserName}}>
        <Navbar setIsModalOpen={setShowModal}/>
        <Outlet />
        {showModal && <Modal showModal={showModal} setShowModal={setShowModal}/>}
      </UserContext.Provider>
    </AuthContext.Provider>
  )
}