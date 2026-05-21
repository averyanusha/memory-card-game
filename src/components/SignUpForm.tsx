import { useState } from 'react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:3000'

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
      const data = await response.json();
  } catch (error){
    console.log(error)
  }
}

export default function SignUpForm () {
  const [email, setEmail] = useState<string>('');
  const [emailVerified, setEmailVerified] = useState<boolean>(true);
  const [displayError, setDisplayError] = useState<string | null>(null);

  function checkEmail (email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailRegex.test(email)) {
      return false;
    }
    return true;
  }

  async function handleSubmit (event: React.SubmitEvent){
    event.preventDefault();
    const email = event.target.elements.namedItem('email') as HTMLInputElement;
    if (!checkEmail(email.value)){
      setEmailVerified(false)
      return false;
    } else {
      setEmail(email.value);
      setEmailVerified(true);
      const result = await emailSend(email.value);
      setDisplayError(result);
      return true;
    }
  }
  return (
    <motion.div className="sign-up">
      <form onSubmit={handleSubmit} className="sign-up-form" noValidate>
        <input type="email" className="sign-up-input" name="email" placeholder="Enter your email"/>
        {(!emailVerified || displayError != null) ? <motion.p className="sign-up-error" transition={{stiffness: 150}} animate={{opacity: 1, display: 'block'}} initial={{opacity: 0, display: 'none'}}>Enter a valid email</motion.p> : null}
        <button className="sign-up-button">Continue</button>
      </form>
    </motion.div>
  )
}