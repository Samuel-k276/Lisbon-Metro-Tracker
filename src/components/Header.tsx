import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={`container ${styles.headerContainer}`}>
        <div className={styles.logoContainer}>
          <Link to="/">
            <div className={styles.logoWrapper}>
              <span className={styles.logoIcon}>M</span>
              <span className={styles.logoText}>Metro Lisboa</span>
            </div>
          </Link>
        </div>

        <div className={styles.hamburgerMenu} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineActive : ''}`}></div>
          <div className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineActive : ''}`}></div>
          <div className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineActive : ''}`}></div>
        </div>

        <nav className={`${styles.mainNav} ${mobileMenuOpen ? styles.open : ''}`}>
          <ul className={styles.navLinks}>
            <li className={location.pathname === '/' ? styles.navLinkActive : ''}>
              <Link to="/">Mapa em Tempo Real</Link>
            </li>
            <li className={location.pathname === '/planear-viagem' ? styles.navLinkActive : ''}>
              <Link to="/planear-viagem">Planeia Viagem</Link>
            </li>
            <li className={location.pathname === '/sobre' ? styles.navLinkActive : ''}>
              <Link to="/sobre">Sobre</Link>
            </li>
            <li className={location.pathname === '/tarifarios' ? styles.navLinkActive : ''}>
              <Link to="/tarifarios">Tarifários</Link>
            </li>
            <li className={location.pathname === '/alertas' ? styles.navLinkActive : ''}>
              <Link to="/alertas" className={styles.alertLink}>
                <span>Alertas</span>
                <div className={styles.alertIndicator}></div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export { Header };
