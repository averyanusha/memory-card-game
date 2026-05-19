import { Route, Routes, Link, createBrowserRouter, RouterProvider} from 'react-router-dom';
import RootLayout from './components/layouts/RootLayout';
import Faq from './components/pages/Faq';
import './App.css'
import Profile from './components/pages/Profile';
import Home from './components/Home';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'faq',
        element: <Faq />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  }
])

function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
