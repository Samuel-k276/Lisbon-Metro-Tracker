import React from 'react';
import { Link } from 'react-router';

import { Routes } from '@/shared/routes';

import styles from './NotFound.module.scss';

const NotFound: React.FC = () => {
  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Página não encontrada</h1>
      <p className={styles.message}>A página que procura não existe.</p>
      <Link to={Routes.HOME} className={styles.homeLink}>
        Voltar ao mapa
      </Link>
    </div>
  );
};

export { NotFound };
