import React from 'react';

import { logger } from '@/shared/utils/logger';

import styles from './ErrorBoundary.module.scss';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logger.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className={styles.page}>
        <span className={styles.code}>500</span>
        <h1 className={styles.title}>Algo correu mal</h1>
        <p className={styles.message}>Ocorreu um erro inesperado. Tente recarregar a página.</p>
        <button className={styles.reloadButton} onClick={this.handleReload}>
          Recarregar página
        </button>
      </div>
    );
  }
}

export { ErrorBoundary };
