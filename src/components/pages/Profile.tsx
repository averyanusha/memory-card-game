import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, AuthContext } from "../layouts/RootLayout";
import { supabase } from "../../supabase";
const API_URL = import.meta.env.VITE_API_URL;

type scoreType = {
  score: number,
  created_at: string
}

export default function Profile () {
  const user = useContext(UserContext);
  const logged = useContext(AuthContext);
  const navigate = useNavigate();
  const maxXp = 8000;
  const [xp, setXp] = useState<number>(0);
  const [scores, setScores] = useState<scoreType[]>([]);
  const [profileImg, setProfileImg] = useState<string>('');
  const token = localStorage.getItem('sign in token');

  useEffect(() => {
    async function getScore() {
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
    async function getAvatar() {
      try {
        const response = await fetch (`${API_URL}/avatar`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json();
        if (response.ok) {
          setProfileImg(data.avatarUrl);
        }
      } catch (error){
        console.log(error);
      }
    }
    getScore();
    getAvatar();
  }, []);

  const handleImgUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(!file)
      return;

    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, {upsert: true});
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const avatarUrl = data.publicUrl;
    setProfileImg(avatarUrl);

    try {
      const response = await fetch(`${API_URL}/avatar`, {
        method: 'POST',
        headers: {
          'Content-type' :'application/json',
          'Authentication': `Bearer ${token}`
        },
        body: JSON.stringify({avatarUrl})
      }) 
    } catch (error) {
      console.log(error);
    }
  }

  function handleNavigate(component: string){
    navigate(component, {replace: true})
  }

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
              <li className='sidebar-element'>
                <button onClick={() => {logged?.setIsLoggedIn(false), handleNavigate('/')}}>Log out</button>
              </li>
            </ul>
          </div>
          <div className='profile-right'>
            <div className='profile-header'>
              <label htmlFor='image-upload' className="custom-image-upload">
                <img src={profileImg ? profileImg : '/src/assets/profile-image.jpg'} alt="profile-image" className="profile-image"/>
              </label>
              <input name='photo' id="image-upload" type='file' accept='.png, .jpg, .jpeg' onChange={handleImgUpload} className="profile-image-upload"/>
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