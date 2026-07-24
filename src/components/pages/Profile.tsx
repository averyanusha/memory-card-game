import { useState, useContext } from "react";
import { UserContext } from "../layouts/RootLayout";

export default function Profile () {
  const user = useContext(UserContext);
  const maxXp = 8000;
  const [xp, setXp] = useState<number>(1080);
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
                <h1 className="profile-title">{`Welcome, Name Placeholder ${user?.username}`}</h1>
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
              <div className="inventory">
                <h2>Inventory</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}