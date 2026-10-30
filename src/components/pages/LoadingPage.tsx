import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';


const backdrop: Variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}

const modal: Variants = {
  hidden: {
    y: '-100vh',
    opacity: 0
  },
  visible: {
    y: '100px',
    opacity: 1,
    transition: {
      delay: 0.2, 
      type: 'spring', 
      stiffness: 70
    }
  }
}

export default function LoadingPage() {
  return (
    <AnimatePresence mode='wait'>
      <motion.div className='backdrop' variants={backdrop} animate='visible' initial='hidden' exit='hidden'>
        <motion.div className='loading' variants={modal} animate='visible' initial='hidden'>
          <DotLottieReact src="https://lottie.host/87bca6d5-c36d-49d5-87fd-3f077979ac68/zpqxh1w67H.json" loop autoplay/>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}


