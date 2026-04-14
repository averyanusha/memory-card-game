import sansaStarkCard from '../assets/sansa-stark.jpg'
import jonSnowCard from '../assets/jon-snow.jpg'
import aryaStarkCard from '../assets/arya-stark.jpg'
import branStarkCard from '../assets/bran-stark.jpg'
import greyjoyCard from '../assets/Theon-greyjoy.jpg'
import tyrionCard from '../assets/tyrion-lannister.jpg'
import cerseiCard from '../assets/cersei-lannister.jpg'
import jaimeeCard from '../assets/jaimee-lannister.jpg'
import daenerysCard from '../assets/Daenerys_Targaryen.jpg'
import littleFingerCard from '../assets/Little-finger.jpg'
import highSparrowCard from '../assets/high-sparrow.jpg'
import houndCard from '../assets/the-hound.jpg'
import brienneCard from '../assets/Brienne-tarth.jpg'
import joffreyCard from '../assets/joffrey.jpg'
import hodorCard from '../assets/Hodor.jpg'

type Card = {
  id: number,
  name: string,
  image: string
};

export const CardsDb: Card[] = [
    {id: 1, name: 'Sansa Stark', image: sansaStarkCard},
    {id: 2, name: 'Jon Snow', image: jonSnowCard},
    {id: 3, name: 'Arya Stark', image: aryaStarkCard},
    {id: 4, name: 'Bran Stark', image: branStarkCard},
    {id: 5, name: 'Theon Greyjoy', image: greyjoyCard},
    {id: 6, name: 'Tyrion Lannister', image: tyrionCard},
    {id: 7, name: 'Cersei Lannister', image: cerseiCard},
    {id: 8, name: 'Jaimee Lannister', image: jaimeeCard},
    {id: 9, name: 'Daenerys Targaryen', image: daenerysCard},
    {id: 10, name: 'Little Finger', image: littleFingerCard},
    {id: 11, name: 'High Sparrow', image: highSparrowCard},
    {id: 12, name: 'The Hound', image: houndCard},
    {id: 13, name: 'Brienne of Tarth', image: brienneCard},
    {id: 14, name: 'Joffrey Baratheon', image: joffreyCard},
    {id: 15, name: 'Hodor', image: hodorCard}
  ];