import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function LoadingPage() {
  const text = 'Loading...'
  const loader = {
    hidden: {
      opacity: 1
    },
    visible: {
      opacity: 1,
      transition: {
        repeat: Infinity,
        repeatDelay: 0,
        staggerChildren: 0.08
      }
    }
  }
  const loaderLetters = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      }
    }
  }
  return (
    <motion.div className="container loading">
      <div className="loading-wrapper">
        <DotLottieReact src="https://lottie.host/b2558729-e551-42e4-9448-658cdfbafb35/4TP9IzC2Tj.lottie" loop autoplay/>
        <motion.h1 variants={loader} initial="hidden" animate="visible" className='loading-text'>
          {text.split("").map((char, index) => {
            return (
              <motion.span key={char + "-" + index} variants={loaderLetters}>
                {char}
              </motion.span>
            )
          })}
        </motion.h1>
      </div>
    </motion.div>
  )
}