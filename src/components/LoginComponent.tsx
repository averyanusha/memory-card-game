import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { VerifyEmailContext } from './layouts/RootLayout';
const API_URL = import.meta.env.VITE_API_URL;

export default function LoginForm({email, onSuccess} : {email: string, onSuccess:() => void}) {
  const [ password, setPassword ] = useState<string>('');
  const [ passwordShow, setPasswordShow ] = useState<boolean>(false);
  const emailVerify = useContext(VerifyEmailContext);
  if (!emailVerify) return;
  const {emailVerified, setEmailVerified} = emailVerify;

  async function handleLogin(event: React.SubmitEvent){
    try {
      event.preventDefault();
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setEmailVerified(data.emailConfirmed);
        localStorage.setItem('sign in token', data.signInToken);
        const score = localStorage.getItem('score');
        if (score) {
          const saveScoreInDb= async(token: string) => {
            const response = await fetch(`${API_URL}/save-score`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({score})
            })
            const data = await response.json();
            if (response.ok) {
              localStorage.removeItem('score');
            }
          }
          saveScoreInDb(data.signInToken);
        }
        onSuccess();
        setEmailVerified(data.verified);
      }
    } catch (error){
      console.log(error);
    }
  }

  return (
    <motion.div className="sign-up">
      <h1 className="modal-title">Log in</h1>
      <form className="modal-form" onSubmit={handleLogin}>
        <input type="email" value={email} name="email" className="sign-up-input"/>
        <div className="password-wrapper">
          <input type={passwordShow ? "text" : "password"} placeholder="Enter your password" name="password" className="sign-up-input" onChange={(e) => {setPassword(e.target.value)}}/>
          <button className={passwordShow ? "password-visible password-button" : "password-hidden password-button"} onClick={() => setPasswordShow(!passwordShow)}></button>
        </div>
        <button type="submit" className="sign-up-button">Log in</button>
      </form>
    </motion.div>
  )
}