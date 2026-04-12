import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes as RouterRoutes, Route } from 'react-router-dom';

import { Alerts } from '@/features/alerts/Alerts';
import { Home } from '@/features/map/Home';
import { PlanearViagem } from '@/features/planner/PlanearViagem';
import { StationDetail } from '@/features/stations/StationDetail';
import { TrainDetail } from '@/features/trains/TrainDetail';
import { Footer } from '@/layout/Footer';
import { Header } from '@/layout/Header';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { NotFound } from '@/shared/components/NotFound';
import { TrainProvider } from '@/shared/contexts/TrainContext';
import { Routes } from '@/shared/routes';

import '@/shared/styles/global.scss';

const App: React.FC = () => {
  return (
    <Router>
      <TrainProvider>
        <a href='#main-content' className='skip-link'>
          Saltar para o conteúdo
        </a>
        <Header />
        <main id='main-content' className='main-content'>
          <RouterRoutes>
            <Route path={Routes.HOME} element={<Home />} />
            <Route path={Routes.ALERTS} element={<Alerts />} />
            <Route path={Routes.PLANNER} element={<PlanearViagem />} />
            <Route path={Routes.STATION} element={<StationDetail />} />
            <Route path={Routes.TRAIN} element={<TrainDetail />} />
            <Route path='*' element={<NotFound />} />
          </RouterRoutes>
        </main>
        <Footer />
      </TrainProvider>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
