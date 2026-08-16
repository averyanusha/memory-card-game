import { useParams, useNavigate, Navigate, replace } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "./layouts/RootLayout";
const FRONTEND_URL = import.meta.env.FRONTEND_URL;

export default function VerifyEmail(){
  const { token } = useParams();
  const authState = useContext(AuthContext);
  const navigate = useNavigate();
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    const verifyToken = async () => {
      const response = await fetch(`${FRONTEND_URL}/confirm-email`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        timeout.current = setTimeout(() => {
          handleNavigate()
        }, 5000)
      }
    }
    verifyToken()
  }, [])

  function handleNavigate() {
    navigate('/profile', {replace: true});
    timeout.current && clearTimeout(timeout.current);
  }

  return (
    <>
      <h1>Thank you for confirming your email</h1>
      <p>You will be redirected to your profile page shortly</p>
      <p>If you were not redirected click
        <button onClick={() => {handleNavigate()}}>here</button>
      </p>
    </>
  )
}