import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes as RouterRoutes, Route } from 'react-router';

import { Home } from '@/features/map/Home';
import { Footer } from '@/layout/Footer';
import { Header } from '@/layout/Header';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { NotFound } from '@/shared/components/NotFound';
import { Spinner } from '@/shared/components/Spinner';
import { TrainProvider } from '@/shared/contexts/TrainContext';
import { Routes } from '@/shared/routes';

import '@/shared/styles/global.scss';

const Alerts = lazy(() => import('@/features/alerts/Alerts').then((m) => ({ default: m.Alerts })));
const PlanearViagem = lazy(() =>
  import('@/features/planner/PlanearViagem').then((m) => ({ default: m.PlanearViagem })),
);
const StationDetail = lazy(() =>
  import('@/features/stations/StationDetail').then((m) => ({ default: m.StationDetail })),
);
const TrainDetail = lazy(() =>
  import('@/features/trains/TrainDetail').then((m) => ({ default: m.TrainDetail })),
);

const App: React.FC = () => {
  return (
    <Router>
      <TrainProvider>
        <a href='#main-content' className='skip-link'>
          Saltar para o conteúdo
        </a>
        <Header />
        <main id='main-content' className='main-content'>
          <Suspense fallback={<Spinner />}>
            <RouterRoutes>
              <Route path={Routes.HOME} element={<Home />} />
              <Route path={Routes.ALERTS} element={<Alerts />} />
              <Route path={Routes.PLANNER} element={<PlanearViagem />} />
              <Route path={Routes.STATION} element={<StationDetail />} />
              <Route path={Routes.TRAIN} element={<TrainDetail />} />
              <Route path='*' element={<NotFound />} />
            </RouterRoutes>
          </Suspense>
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
