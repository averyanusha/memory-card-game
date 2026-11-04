import { motion } from 'framer-motion';
import type { ErrorStatus } from '../../types';
import brokenWand from '../../assets/broken_wand.png'

export default function ErrorPage({ code, onDismiss} : {
  code: ErrorStatus;
  onDismiss: () => void}) {
  const ErrorMessages: Record<ErrorStatus, string> = {
    THEME_REJECTED: `We couldn't generate that theme for you. Please try something else.`,
    RATE_LIMITED: 'We too many requests right now. Please try again in a moment.',
    GENERATION_FAILED: 'Something went wrong on our end. Try again',
    NETWORK: `Couldn't reach the server. Check your connection.`,
    JOB_NOT_FOUND: 'Something went wrong on our end. Try again'
  }
  return (
    <>
      <motion.div className="container error">
        <img src={brokenWand} alt="broken magic wand" className='error-image'/>
        <h1 className='error-title'>404</h1>
        <h2 className='error-message'>{code}</h2>
        <button onClick={onDismiss} className='error-button'>Try again</button>
      </motion.div>
    </>
  )
}