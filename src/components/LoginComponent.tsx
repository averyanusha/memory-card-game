import { useState } from 'react';
import { motion } from 'framer-motion';
const API_URL = 'http://localhost:3000'

export default function LoginForm({email, onSuccess} : {email: string, onSuccess:() => void}) {
  const [ password, setPassword ] = useState<string>('');
  const [ passwordShow, setPasswordShow ] = useState<boolean>(false);

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
        localStorage.setItem('token', data.token);
        onSuccess();
      }
    } catch (error){
      console.log(error);
    }
  }

  return (
    <motion.div className="sign-up">
      <h1 className="modal-title">Log in</h1>
      <h2 className="modal-subtitle">Looks like the user with this email already exists</h2>
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