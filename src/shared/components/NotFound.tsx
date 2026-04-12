import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '@/shared/routes';
import styles from './NotFound.module.scss';

const NotFound: React.FC = () => {
  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.message}>The page you're looking for doesn't exist.</p>
      <Link to={Routes.HOME} className={styles.homeLink}>
        Back to map
      </Link>
    </div>
  );
};

export { NotFound };
