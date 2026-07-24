import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/game-of-thrones-logo.png';
import { useContext } from 'react';
import { ModalContext } from '../layouts/RootLayout';

export default function Navbar() {
  const modalOpen = useContext(ModalContext);
  const navigate = useNavigate();

  function handleNavigate(){
    navigate('/', {replace: true})
  }

  return (
    <div className='nav'>
      <NavLink to='/' className='nav-logo'>
        <img src={logo} alt="got-logo"/>
      </NavLink>
      <input type='text' className='nav-search'/>
      <NavLink to='/faq' className='nav-button'>Help</NavLink>
      <button className='nav-button' onClick={() => modalOpen?.setShowModal(true)}>Log in</button>
      <button className='nav-button' onClick={() => {handleNavigate()}}>Start the game</button>
    </div>
  )
}