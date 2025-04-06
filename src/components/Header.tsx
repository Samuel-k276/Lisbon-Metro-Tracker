import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo-container">
          <Link to="/">
            <b className="logo">Metro</b>
          </Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Mapa em Tempo Real</Link></li>
            <li><Link to="/linhas">Linhas</Link></li>
            <li><Link to="/horarios">Horários</Link></li>
            <li><Link to="/alertas">Alertas</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
