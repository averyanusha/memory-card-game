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

      const data = await response.json();
  } catch (error){
    console.log(error)
  }
}

export default function SignUpForm () {
  const [email, setEmail] = useState<string>('');
  const [emailVerified, setEmailVerified] = useState<boolean>(true);

  function checkEmail (email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailRegex.test(email)) {
      return false;
    }
    return true;
  }

  function handleSubmit (event: React.SubmitEvent){
    event.preventDefault();
    const email = event.target.elements.namedItem('email') as HTMLInputElement;
    if (!checkEmail(email.value)){
      setEmailVerified(false)
      return false;
    } else {
      setEmail(email.value);
      setEmailVerified(true);
      emailSend(email.value);
      return true;
    }
  }
  return (
    <motion.div className="sign-up">
      <form onSubmit={handleSubmit} className="sign-up-form">
        <input type="email" className="sign-up-input" required name="email" placeholder="Enter your email"/>
        {!emailVerified ? <p>Enter valid email</p> : ''}
        <button className="sign-up-button">Continue</button>
      </form>
    </motion.div>
  )
}