import { useState } from 'react'
import sansaStarkCard from '../src/assets/sansa-stark.jpg'
import jonSnowCard from '../src/assets/jon-snow.jpg'
import aryaStarkCard from '../src/assets/arya-stark.jpg'
import branStarkCard from '../src/assets/bran-stark.jpg'
import greyjoyCard from '../src/assets/Theon-greyjoy.jpg'
import tyrionCard from '../src/assets/tyrion-lannister.jpg'
import cerseiCard from '../src/assets/cersei-lannister.jpg'
import jaimeeCard from '../src/assets/jaimee-lannister.jpg'
import daenerysCard from '../src/assets/Daenerys_Targaryen.jpg'
import littleFingerCard from '../src/assets/Little-finger.jpg'
import highSparrowCard from '../src/assets/high-sparrow.jpg'
import houndCard from '../src/assets/the-hound.jpg'
import './App.css'

function App() {
  type Card = {
    id: number,
    name: string,
    image: string
  };

  const cardsDb: Card[] = [
    {id: 1, name: 'Sansa Stark', image: sansaStarkCard},
    {id: 2, name: 'Jon Snow', image: jonSnowCard},
    {id: 3, name: 'Arya Stark', image: aryaStarkCard},
    {id: 4, name: 'Bran Stark', image: branStarkCard},
    {id: 5, name: 'Theon Greyjoy', image: greyjoyCard},
    {id: 6, name: 'Tyrion Lannister', image: tyrionCard},
    {id: 7, name: 'Cersei Lannister', image: cerseiCard},
    {id: 8, name: 'Jaimee Lannister', image: jaimeeCard},
    {id: 9, name: 'Daenerys Targaryen', image: daenerysCard},
    {id: 10, name: 'Little Finger', image: littleFingerCard},
    {id: 11, name: 'High Sparrow', image: highSparrowCard},
    {id: 12, name: 'The Hound', image: houndCard}
  ]
  // const clickedIds: number [] = [];

  return (
    <>
    </>
  )
}

export default App
