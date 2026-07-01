import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Modal from '../Modal';
import Profile from '../pages/Profile';
import { useEffect, useState } from 'react';
const API_URL = 'http://localhost:3000'


export default function RootLayout(){
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('')
  useEffect(() => {
    const checkIfTokenExists = async () => {
      const token = localStorage.getItem('token');
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
        setUsername(data.username)
      }
    }
    checkIfTokenExists();
  }, [])
  return (
    <div className='root-element'>
      <Navbar setIsModalOpen={setShowModal}/>
      <Outlet />
      {showModal && <Modal showModal={showModal} setShowModal={setShowModal} setIsLoggedIn={setIsLoggedIn}/>}
      {isLoggedIn && <Profile name={username}/>}
    </div>
  )
}