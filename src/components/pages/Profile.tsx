import { useState, useContext, useEffect } from "react";
import { UserContext } from "../layouts/RootLayout";
const API_URL = 'http://localhost:3000'

type scoreType = {
  score: number,
  created_at: string
}

export default function Profile () {
  const user = useContext(UserContext);
  const maxXp = 8000;
  const [xp, setXp] = useState<number>(0);
  const [scores, setScores] = useState<scoreType[]>([]);

  useEffect(() => {
    async function getScore() {
      const token = localStorage.getItem('sign in token')
      try {
        const response = await fetch(`${API_URL}/get-score`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json();
        if (response.ok) {
          setScores(data.historicScore);
          setXp(data.totalXp)
        }
      } catch (error) {
        console.log(error);
      }
    }
    getScore();
  }, []);

  return (
    <>
      <div className='container'>
        <div className='profile'>
          <div className='profile-left'>
            <ul className='profile-sidebar'>
              <li className='sidebar-element'>
                <button>Leaderboard</button>
              </li>
              <li className='sidebar-element'>
                <button>Notifications</button>
              </li>
              <li className='sidebar-element'>
                <button>Support</button>
              </li>
              <li className='sidebar-element'>
                <button>Settings</button>
              </li>
            </ul>
          </div>
          <div className='profile-right'>
            <div className='profile-header'>
              <img src="/src/assets/profile-image.jpg" alt="profile-image" className="profile-image"/>
              <div className="profile-info">
                <h1 className="profile-title">{`Welcome,${user?.username}`}</h1>
                <p className="profile-subtitle">the title of the player</p>
                <div className="profile-level">
                  <p className="profile-subtitle">{xp}/{maxXp}xp</p>
                  <div className="level-background">
                    <div className="lever-bar" style={{ width: `${(xp / maxXp) * 100}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className='profile-gains'>
              <div className="achievements">
                <h2>Achievements</h2>
              </div>
              <div className="history">
                <h2>Score history</h2>
                {scores?.map((entry, entryIndex) => {
                  return (
                    <div className="history-scores" key={entryIndex}>
                      <ul>
                        <li>{entry.score}</li>
                      </ul>
                      <ul>
                        <li>{entry.created_at.split('T')[0]}</li>
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}