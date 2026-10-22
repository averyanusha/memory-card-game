import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";

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

export default function Submitting() {
  return (
    <AnimatePresence mode={'wait'}>
      <motion.div className='backdrop' variants={backdrop} animate='visible' initial='hidden' exit='hidden'>
        <motion.div className='modal' variants={modal} animate='visible' initial='hidden'>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}