import React from 'react';
import { BrowserRouter as Router, Routes as RouterRoutes, Route } from 'react-router-dom';
import { Home } from '@/features/map/Home';
import { Header } from '@/layout/Header';
import { Footer } from '@/layout/Footer';
import { StationDetail } from '@/features/stations/StationDetail';
import { TrainDetail } from '@/features/trains/TrainDetail';
import { Alerts } from '@/features/alerts/Alerts';
import { PlanearViagem } from '@/features/planner/PlanearViagem';
import { TrainProvider } from '@/shared/contexts/TrainContext';
import { Routes } from '@/shared/routes';

const App: React.FC = () => {
  return (
    <Router>
      <TrainProvider>
        <div className='app'>
          <Header />
          <main className='main-content'>
            <RouterRoutes>
              <Route path={Routes.HOME} element={<Home />} />
              <Route path={Routes.ALERTS} element={<Alerts />} />
              <Route path={Routes.PLANNER} element={<PlanearViagem />} />
              <Route path={Routes.STATION} element={<StationDetail />} />
              <Route path={Routes.TRAIN} element={<TrainDetail />} />
              <Route path='*' element={<div>404 Not Found</div>} />
            </RouterRoutes>
          </main>
          <Footer />
        </div>
      </TrainProvider>
    </Router>
  );
};

export { App };
