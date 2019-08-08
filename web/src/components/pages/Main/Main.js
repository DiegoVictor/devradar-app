import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './Main.css';
import Logo from '../../../assets/logo.svg';
import Loading from '../../../components/Loading/Loading';
import Api from '../../../services/Api';

export default function Main({ match }) {
  const [developers, setDevelopers] = useState([]);

  let [preload, setPreloading] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await Api.get('/developers', {
        headers: { user: match.params.id }
      });
      setDevelopers(response.data);
      setPreloading(true);
      
      // TODO get user to fill the profile bar
    })();
  }, [match.params.id]);

  async function handleLike(id) {
    await Api.post(`/developers/${id}/like`, {}, {
      headers: { user: match.params.id }
    });
    setDevelopers(developers.filter(developer => developer._id !== id));
  };

  async function handleDislike(id) {
    await Api.post(`/developers/${id}/dislike`, {}, {
      headers: { user: match.params.id }
    });
    setDevelopers(developers.filter(developer => developer._id !== id));
  };

  return (
    <div className="main-container">
      <div className="developer-bar">
        <div className="brand">
          <img src={Logo} alt="Tindev"/>
        </div>
        <Link to="/" title="Sair">
          <div className="developer-profile">
              <img title="Diego Victor" src="https://avatars3.githubusercontent.com/u/15165349?v=4" alt="Diego Victor"/>
              <div class="logout">
              <svg width="24px" height="24px" viewBox="0 0 24 24">
                <path fill="#DF4723" d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z" />
              </svg>
              </div>
          </div>
        </Link>
      </div>
      {developers.length > 0 ? (
        <ul>
          {developers.map(developer => (
            <li key={developer._id}>
              <img src={developer.avatar} alt={developer.name} />
              <footer>
                <strong>{developer.name}</strong>
                <p>{developer.bio}</p>
              </footer>

              <div className="buttons">
                <button title="Sai da minha stack developer nutela" type="button" onClick={() => handleDislike(developer._id)}>
                  <svg width="24px" height="24px" viewBox="0 0 24 24">
                    <path fill="#000000" d="M16.5,5.5A2,2 0 0,0 18.5,3.5A2,2 0 0,0 16.5,1.5A2,2 0 0,0 14.5,3.5A2,2 0 0,0 16.5,5.5M12.9,19.4L13.9,15L16,17V23H18V15.5L15.9,13.5L16.5,10.5C17.89,12.09 19.89,13 22,13V11C20.24,11.03 18.6,10.11 17.7,8.6L16.7,7C16.34,6.4 15.7,6 15,6C14.7,6 14.5,6.1 14.2,6.1L9,8.3V13H11V9.6L12.8,8.9L11.2,17L6.3,16L5.9,18L12.9,19.4M4,9A1,1 0 0,1 3,8A1,1 0 0,1 4,7H7V9H4M5,5A1,1 0 0,1 4,4A1,1 0 0,1 5,3H10V5H5M3,13A1,1 0 0,1 2,12A1,1 0 0,1 3,11H7V13H3Z" />
                  </svg>
                </button>
                <button title="Bora #codar" type="button" onClick={() => handleLike(developer._id)}>
                  <svg width="24px" height="24px" viewBox="0 0 24 24">
                    <path fill="#000000" d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          { !preload ? (<Loading />) : 'Sem sugestões no momento :('}
        </div>
      ) }
    </div>
  );
}