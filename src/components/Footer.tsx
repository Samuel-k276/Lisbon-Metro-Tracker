import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-columns">
          <div className="footer-column">
            <h4>Metro de Lisboa</h4>
            <ul>
              <li><Link to="/historia">História</Link></li>
              <li><Link to="/contactos">Contactos</Link></li>
              <li><Link to="/servicos">Serviços</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Informações</h4>
            <ul>
              <li><Link to="/tarifarios">Tarifários</Link></li>
              <li><Link to="/planeador">Planear Viagem</Link></li>
              <li><Link to="/acessibilidade">Acessibilidade</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Redes Sociais</h4>
            <div className="social-links">
              <a href="https://www.facebook.com/MetroLisboa" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com/metro_lisboa" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://www.instagram.com/metrolisboa" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Metro de Lisboa. Todos os direitos reservados.</p>
          <p>Esta aplicação é apenas uma demonstração e não está afiliada oficialmente ao Metro de Lisboa.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
