import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/game-of-thrones-logo.png';
import { useContext } from 'react';
import { ModalContext, GameContext, AuthContext } from '../layouts/RootLayout';

export default function Navbar() {
  const modalOpen = useContext(ModalContext);
  const navigate = useNavigate();
  const cards = useContext(GameContext);
  const logged = useContext(AuthContext);
  if (!cards) throw new Error('GameContext used outside its provider');
  const {resetCards} = cards;

  function handleNavigate(component: string){
    navigate(component, {replace: true})
  }

  return (
    <div className='nav'>
      <NavLink to='/' className='nav-logo'>
        <img src={logo} alt="got-logo"/>
      </NavLink>
      <input type='text' className='nav-search'/>
      <NavLink to='/faq' className='nav-button'>Help</NavLink>
      <button className='nav-button profile-button' onClick={() => {logged?.isLoggedIn ? (handleNavigate('/profile'), resetCards()) : modalOpen?.setShowModal(true)}}></button>
      <button className='nav-button' onClick={() => {handleNavigate('/'), resetCards()}}>Start the game</button>
    </div>
  )
}