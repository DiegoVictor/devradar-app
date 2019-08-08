import React, { useState } from "react";
import './Login.css';
import Logo from '../../../assets/logo.svg';
import Api from '../../../services/Api';

export default function Login({ history }) {
  const [username, setUsername] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await Api.post('/developers', { username });
    history.push(`/developers/${response.data._id}`);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={Logo} alt="Tindev" />
        <input
          value={username} onChange={event => setUsername(event.target.value)}
          type="text" placeholder="Digite seu usuário no Github"
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}