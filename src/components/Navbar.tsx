import { NavLink, useNavigate } from 'react-router-dom';
import logo from './../assets/game-icon.svg';
import { useContext } from 'react';
import { ModalContext, AuthContext } from './contexts/Contexts';
import { GameContext } from './contexts/GameState';
import { CardSetContext } from './contexts/Contexts';

export default function Navbar() {
  const modalOpen = useContext(ModalContext);
  const navigate = useNavigate();
  const game = useContext(GameContext);
  const logged = useContext(AuthContext);
  if (!game) throw new Error('GameContext used outside its provider');
  const cards = useContext(CardSetContext);
  if (!cards) throw new Error('CardContext is outside its provider')
  const {chooseNewTheme} = game;

  function handleNavigate(component: string){
    navigate(component, {replace: true})
  }

  return (
    <>
      <div className='nav'>
        <NavLink to='/' className='nav-logo'>
          <img src={logo} alt="got-logo"/>
        </NavLink>
        <input type='text' className='input'/>
        <NavLink to='/faq' className='nav-button'>Help</NavLink>
        <button className='nav-button profile-button' onClick={() => {logged?.isLoggedIn ? handleNavigate('/profile') : modalOpen?.setShowModal(true)}}></button>
        <button className='nav-button' onClick={() => {chooseNewTheme()}}>Start the game</button>
      </div>
    </>
  )
}