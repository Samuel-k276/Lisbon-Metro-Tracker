import React from 'react';

import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>
        Projeto open-source &middot;{' '}
        <a
          href='https://github.com/Samuel-k276/Lisbon-Metro-Tracker'
          target='_blank'
          rel='noopener noreferrer'
        >
          GitHub
        </a>
      </p>
      <p className={styles.disclaimer}>Não afiliado oficialmente ao Metro de Lisboa.</p>
    </footer>
  );
};

export { Footer };
