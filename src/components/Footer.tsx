import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Metro de Lisboa. Todos os direitos reservados.</p>
          <p>Esta aplicação é apenas uma demonstração e não está afiliada oficialmente ao Metro de Lisboa.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
