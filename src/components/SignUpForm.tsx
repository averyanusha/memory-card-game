import { use, useState } from 'react';
import { motion } from 'framer-motion';
const API_URL = 'http://localhost:3000'

export default function SignUpForm ({email, onSuccess} : {email: string, onSuccess:() => void}) {
  const [ username, setUsername ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ secondPassword, setSecondPassword ] = useState<string>('');
  const [ passwordError, setPasswordError ] = useState<boolean>(false);
  const [ passwordShow, setPasswordShow ] = useState<boolean>(false);
  const [ passwordRepeatShow, setPasswordRepeatShow ] = useState<boolean>(false)

  async function handleSignup(event: React.SubmitEvent) {
    event.preventDefault();
    if (password.length === secondPassword.length && password === secondPassword) {
      setPasswordError(false);
    } else setPasswordError(true);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-type' : 'application/json'
        },
        body: JSON.stringify({email, username, password})
      })
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token)
        onSuccess();
      }
    } catch (error){
      console.log(error);
    }
  }
  
  return (
    <motion.div className="sign-up">
      <form onSubmit={handleSignup}>
        <input type="email" value={email} className="sign-up-input"/>
        <input type="text" placeholder="Username" name="username" className="sign-up-input" onChange={(e) => {setUsername(e.target.value)}}/>
        <div className="password-wrapper">
          <input type={passwordShow ? "text" :"password"} placeholder="Password" name="password" className="sign-up-input" onChange={(e) => {setPassword(e.target.value)}}/>
          <button className={passwordShow ? "password-visible password-button" : "password-hidden password-button"} onClick={() => setPasswordShow(!passwordShow)}></button>
        </div>
        <div className="password-wrapper">
          <input type={passwordRepeatShow ? "text" :"password"} placeholder="Repeat password" name="password" className="sign-up-input" onChange={(e) => {setSecondPassword(e.target.value)}}/>
          <button className={passwordRepeatShow ? "password-visible password-button" : "password-hidden password-button"} onClick={() => setPasswordRepeatShow(!passwordRepeatShow)}></button>
        </div>
        {!passwordError ? '' : <p className="sign-up-error">Passwords do not match</p>}
        <button type="submit" className="sign-up-button">Submit</button>
      </form>
    </motion.div>
  )
}