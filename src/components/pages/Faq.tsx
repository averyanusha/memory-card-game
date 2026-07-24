export default function Faq(){
  return (
    <>
    <div className='container'>
      <h1 className="title">Game Rules</h1>
      <p className='subtitle'>Test your memory</p>
      <ul className='rules'>
        <li className='rules-item'>Choose the level of difficulty</li>
        <li className='rules-item'>Choose one of the cards, memorize it, click on it</li>
        <li className='rules-item'>After the cards are shuffled click on the other card</li>
        <li className='rules-item'>Your goal is not to click on the same card twice</li>
        <li className='rules-item'>For every won game you gain 100xp and for every time you stayed in the game more than 3 rounds you gain 20xp</li>
      </ul>
    </div>
    </>
  )
}