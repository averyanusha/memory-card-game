import { useState, useContext } from "react";
import { UserContext } from "../layouts/RootLayout";

export default function Profile () {
  const user = useContext(UserContext);
  return (
    <>
      <div className='container'>
        <h1>{`Welcome ${user?.username}`}</h1>
      </div>
    </>
  )
}