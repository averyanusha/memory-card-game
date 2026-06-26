import { useState } from 'react';
import { motion } from 'framer-motion';
const API_URL = 'http://localhost:3000'

export default function SignUpForm ({email} : {email: string}) {
  return (
    <motion.div className="sign-up">
      <form action="">
        <input type="email" value={email} className="sign-up-input"/>
        <input type="text" placeholder="Username" name="username" className="sign-up-input"/>
        <input type="password" placeholder="Password" name="password" className="sign-up-input"/>
        <input type="password" placeholder="Repeat your password" name="password" className="sign-up-input"/>
      </form>
    </motion.div>
  )
}