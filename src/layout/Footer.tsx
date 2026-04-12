import React from "react";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Metro de Lisboa. Todos os direitos reservados.</p>
          <p>
            Esta aplicação é apenas uma demonstração e não está afiliada oficialmente ao Metro de
            Lisboa.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
