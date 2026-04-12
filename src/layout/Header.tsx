import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Routes } from '@/shared/routes';

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
        <Link to={Routes.HOME} className={styles.logoWrapper}>
          <span className={styles.logoIcon}>M</span>
          <span className={styles.logoText}>Metro Lisboa</span>
        </Link>

        <button
          className={styles.hamburgerMenu}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label='Abrir/fechar menu de navegação'
          aria-expanded={mobileMenuOpen}
        >
          <div
            className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineActive : ''}`}
          ></div>
          <div
            className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineActive : ''}`}
          ></div>
          <div
            className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineActive : ''}`}
          ></div>
        </button>

        <nav
          className={`${styles.mainNav} ${mobileMenuOpen ? styles.open : ''}`}
          aria-label='Main navigation'
        >
          <ul className={styles.navLinks}>
            <li
              className={location.pathname === Routes.HOME ? styles.navLinkActive : ''}
              {...(location.pathname === Routes.HOME ? { 'aria-current': 'page' as const } : {})}
            >
              <Link to={Routes.HOME}>Mapa em Tempo Real</Link>
            </li>
            <li
              className={location.pathname === Routes.PLANNER ? styles.navLinkActive : ''}
              {...(location.pathname === Routes.PLANNER ? { 'aria-current': 'page' as const } : {})}
            >
              <Link to={Routes.PLANNER}>Planeia Viagem</Link>
            </li>
            <li
              className={location.pathname === Routes.ALERTS ? styles.navLinkActive : ''}
              {...(location.pathname === Routes.ALERTS ? { 'aria-current': 'page' as const } : {})}
            >
              <Link to={Routes.ALERTS} className={styles.alertLink}>
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
