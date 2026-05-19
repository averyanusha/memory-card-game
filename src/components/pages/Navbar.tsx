import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/game-of-thrones-logo.png';

export default function Navbar({setIsModalOpen}: { setIsModalOpen: (value : boolean) => void} ) {
  return (
    <div className='nav'>
      <NavLink to='/' className='nav-logo'>
        <img src={logo} alt="got-logo"/>
      </NavLink>
      <input type='text' className='nav-search'/>
      <NavLink to='/faq' className='nav-button'>Help</NavLink>
      <button className='nav-button' onClick={() => setIsModalOpen(true)}>Log in</button>
    </div>
  )
}