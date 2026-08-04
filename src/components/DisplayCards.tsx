import { useState, useContext } from 'react';
import { CardsDb } from './CardDatabase';
import { motion } from 'motion/react'
import backOfTheCard from '../assets/cards-cover.jpg'
import { GameContext } from './layouts/RootLayout';

export default function DisplayCards ({flip, setFlip, timeout, handleClickedCards}: {
  flip: boolean,
  setFlip: (value : boolean) => void,
  timeout: React.RefObject <number | null>,
  handleClickedCards: (id: number) => void}) {

  const cards = useContext(GameContext);
  if (!cards) throw new Error('CardContext used outside its provider');
  const {displayCards, setDisplayCards} = cards;
  return (
    <div className='cards'>
      {displayCards.map((id, index) => {
        const card = CardsDb.find(card => card.id === id)
        if (!card)
          return null;
        return (
          <motion.div key={index} className='card'>
            <button className='card-button' onClick={() => {
              setFlip(false)
              timeout.current = setTimeout(() => {
                handleClickedCards(id)
                setFlip(true)
                }, 1000)}}>
              <motion.img src={flip ? card.image : backOfTheCard} alt={card.name} className='card-img' transition={{type: 'spring', duration: 0.7, stiffness: 30}} animate={{rotateY: flip ? 0 : 180}}/>
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}