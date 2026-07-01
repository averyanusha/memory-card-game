export default function Profile (name: {name: string}) {
  return (
    <>
      <div className='container'>
        <h1>{`Welcome ${name}`}</h1>
      </div>
    </>
  )
}