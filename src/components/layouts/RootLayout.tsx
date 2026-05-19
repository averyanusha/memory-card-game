import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Modal from '../Modal';
import { useState } from 'react';


export default function RootLayout(){

  const [showModal, setShowModal] = useState<boolean>(false);
  
  return (
    <div className='root-element'>
      <Navbar setIsModalOpen={setShowModal}/>
      <Outlet />
      {showModal && <Modal showModal={showModal} setShowModal={setShowModal}/>}
    </div>
  )
}