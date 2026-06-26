import { useState } from 'react';
import { AnimatePresence, motion} from 'framer-motion';
import type { Variants } from 'framer-motion';
import LoginForm from "./LoginComponent";
import SignUpForm from './SignUpForm';
const API_URL = 'http://localhost:3000'

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
  const [email, setEmail] = useState<string>('');
  const [emailVerified, setEmailVerified] = useState<boolean>(true);
  const [userExists, setUserExists] = useState<boolean>(false);
  const [displayError, setDisplayError] = useState<string | null>(null);


  async function emailSend(email: string){
    try {
      const response = await fetch(`${API_URL}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
      })
      if (!response.ok) {
        const errorMessage = await response.json();
        console.log(errorMessage);
        return errorMessage;
      }
      if (response.ok) {
        const data = await response.json();
        setUserExists(data.login);
      }
    } catch (error){
      console.log(error)
    }
  }


  function checkEmail (email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailRegex.test(email)) {
      return false;
    }
    return true;
  }

  async function verifyEmailExists (event: React.SubmitEvent){
    event.preventDefault();
    const emailInput = event.target.elements.namedItem('email') as HTMLInputElement;
    if (!checkEmail(emailInput.value)){
      setEmailVerified(false)
      return false;
    } else {
      setEmail(emailInput.value);
      setEmailVerified(true);
      const result = await emailSend(emailInput.value);
      setDisplayError(result);
      return true;
    }
  }
  return (
    <AnimatePresence mode='wait'>
      { showModal && (
        <motion.div className='backdrop' variants={backdrop} animate='visible' initial='hidden' exit='hidden'>
          <motion.div className='modal' variants={modal} animate='visible' initial='hidden'>
            {email ? (userExists ? <LoginForm email={email} /> : <SignUpForm email={email}/>) : (
              <motion.div className="sign-up">
                <h1 className="modal-title">Sign in</h1>
                <form onSubmit={verifyEmailExists} className="sign-up-form" noValidate>
                  <input type="email" className="sign-up-input" name="email" placeholder="Email"/>
                  {(!emailVerified || displayError != null) ? <motion.p className="sign-up-error" transition={{stiffness: 150}} animate={{opacity: 1, display: 'block'}} initial={{opacity: 0, display: 'none'}}>Enter a valid email</motion.p> : null}
                  <button type="submit" className="sign-up-button">Continue</button>
                </form>
              </motion.div>)}
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