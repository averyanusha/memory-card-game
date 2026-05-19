import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <>
      <h1>Oh no, this pages doesnt exist</h1>
      <p>Go to <Link to='/'>Homepage</Link></p>
    </>
  )
}