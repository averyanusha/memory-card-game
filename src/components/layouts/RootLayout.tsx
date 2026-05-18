import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../pages/Navbar';

export default function RootLayout(){
  return (
    <div className='root-element'>
      <Navbar />
      <Outlet />
    </div>
  )
}