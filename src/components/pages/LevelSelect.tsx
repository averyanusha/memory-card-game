import { motion } from "framer-motion";

export default function LevelSelect({startGame}: {startGame: (level: string, count: number) => void}) {
 return (
  <>
    <motion.div className='level' initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.5}}>
      <motion.h2 animate={{ fontSize: '50px', color: '#ffdf99' }}>Choose your level</motion.h2>
      <button className='game-button' onClick={() => {startGame('easy', 5)}}>Easy</button>
      <button className='game-button' onClick={() => {startGame('medium', 10)}}>Medium</button>
      <button className='game-button' onClick={() => {startGame('hard', 15)}}>Hard</button>
    </motion.div>
  </>
 ) 
}