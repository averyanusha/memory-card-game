import { useState } from 'react';
import { motion } from 'framer-motion';
const API_URL = 'http://localhost:3000'

export default function LoginForm({email} : {email: string}) {
  return (
    <motion.div className="sign-up">
      <h1 className="modal-title">Log in</h1>
      <h2>Looks like the user with such email already exists</h2>
      <form action="">
        <input type="email" value={email} name="email" className="sign-up-input"/>
        <input type="password" placeholder="Enter your password" name="password" className="sign-up-input"/>
      </form>
    </motion.div>
  )
}