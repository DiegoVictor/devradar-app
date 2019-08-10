import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';
import Logo from '../../../assets/logo.svg';
import Like from '../../../assets/like.png';
import Dislike from '../../../assets/dislike.png';
import Match from '../../../assets/itsamatch.png';
import Loading from '../../../components/Loading/Loading';
import Api from '../../../services/Api';
import { host, port } from '../../../config/app';

export default function Main({ match }) {
  const [developers, setDevelopers] = useState([]);
  const [match_developer, setMatchDeveloper] = useState(null);

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

  useEffect(() => {
    const socket = io(`${host}:${port}`, {
      query: { developer_id: match.params.id }
    });

    socket.on('match', developer => {
      setMatchDeveloper(developer);
    });
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
              <div className="logout">
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
                  <img src={Dislike} alt="Dislike"/>
                </button>
                <button title="Bora #codar" type="button" onClick={() => handleLike(developer._id)}>
                  <img src={Like} alt="Like"/>
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

      { match_developer && (
        <div className="match-container">
          <img src={Match} alt="It's a Match"/>

          <img className="avatar" src={match_developer.avatar} alt={match_developer.name} />
          <strong>{ match_developer.name }</strong>
          <p>{ match_developer.bio }</p>
          <button type="button" onClick={() => setMatchDeveloper(null)}>Fechar</button>
        </div>
      )}
    </div>
  );
}