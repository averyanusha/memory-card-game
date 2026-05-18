import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/game-of-thrones-logo.png'

export default function Navbar() {
  return (
    <div className='nav'>
      <NavLink to='/' className='nav-logo'>
        <img src={logo} alt="got-logo"/>
      </NavLink>
      <input type='text' className='nav-search'/>
      <NavLink to='/faq' className='nav-button'>FAQ</NavLink>
      <Link to='/' className='nav-button'>Log in</Link>
    </div>
  )
}