import { AnimatePresence, motion} from 'framer-motion';
import type { Variants } from 'framer-motion';
import SignUpForm from './SignUpForm';

const backdrop = {
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

export default function Modal ({showModal, setShowModal} : {showModal: boolean, setShowModal: (value: boolean) => void}) {
  return (
    <AnimatePresence mode='wait'>
      { showModal && (
        <motion.div className='backdrop' variants={backdrop} animate='visible' initial='hidden' exit='hidden'>
          <motion.div className='modal' variants={modal} animate='visible' initial='hidden'>
            <h1 className="modal-title">Sign up</h1>
            <SignUpForm/>
            <button className='modal-close' onClick={() => setShowModal(false)}>X</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// export default function Modal ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
//   return (
//     <AnimatePresence>
//       <motion.div className="modal-backdrop" initial={backdrop.hidden} animate={backdrop.visible} exit={backdrop.hidden}>
//         <motion.div className="modal-content" initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }}>
//           {children}
//           <button className="close-button" onClick={onClose}>Close</button>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }