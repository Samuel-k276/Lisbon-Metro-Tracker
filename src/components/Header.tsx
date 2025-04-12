import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header" style={{ padding: '10px 20px', fontSize: '14px' }}>
      <div className="container">
        <div className="logo-container">
          <Link to="/">
            <b className="logo">Metro</b>
          </Link>
        </div>
        <nav className="main-nav">
          <ul style={{ display: 'flex', gap: '10px', margin: 0, padding: 0, listStyle: 'none' }}>
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
