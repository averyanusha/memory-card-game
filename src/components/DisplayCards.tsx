import { useState, useContext } from 'react';
import { motion } from 'motion/react'
import backOfTheCard from '../assets/cards-cover.jpg'
import { CardSetContext } from './contexts/Contexts';
import { GameContext } from './contexts/GameState';

export default function DisplayCards ({flip, setFlip, timeout, handleClickedCards}: {
  flip: boolean,
  setFlip: (value : boolean) => void,
  timeout: React.RefObject <number | null>,
  handleClickedCards: (id: number) => void}) {

  const cards = useContext(GameContext);
  if (!cards) throw new Error('CardContext used outside its provider');
  const cardSet = useContext(CardSetContext);
  if (!cardSet) throw new Error('CardSet context is outsode its provider');
  const {displayCards} = cards;

  return (
    <div className='cards'>
      {displayCards.map((id, index) => {
        const card = cardSet.cardDeck.find(card => card.id === id)
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