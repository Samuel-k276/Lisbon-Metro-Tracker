import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Detectar scroll para mudar a aparência do header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Fechar menu quando mudar de página
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo-container">
          <Link to="/">
            <div className="logo-wrapper">
              <span className="logo-icon">M</span>
              <span className="logo-text">Metro Lisboa</span>
            </div>
          </Link>
        </div>
        
        <div className="hamburger-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></div>
          <div className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></div>
          <div className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></div>
        </div>
        
        <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/">Mapa em Tempo Real</Link>
            </li>
            <li className={location.pathname === '/linhas' ? 'active' : ''}>
              <Link to="/linhas">Linhas</Link>
            </li>
            <li className={location.pathname === '/sobre' ? 'active' : ''}>
              <Link to="/sobre">Sobre</Link>
            </li>
            <li className={location.pathname === '/tarifarios' ? 'active' : ''}>
              <Link to="/tarifarios">Tarifários</Link>
            </li>
            <li className={location.pathname === '/alertas' ? 'active' : ''}>
              <Link to="/alertas" className="alert-link">
                <span>Alertas</span>
                <div className="alert-indicator"></div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
