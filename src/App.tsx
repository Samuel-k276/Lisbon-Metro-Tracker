import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import StationDetailWrapper from './pages/StationDetailWrapper';
import TrainDetailWrapper from './pages/TrainDetailWrapper';
import Alerts from './pages/Alerts';
import Sobre from './pages/Sobre';
import Tarifarios from './pages/Tarifarios';
import './App.css';

const App: React.FC = () => {
   return (
      <Router>
         <div className="app">
         <Header />
         <main className="main-content">
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/sobre" element={<Sobre />} />
               <Route path="/alertas" element={<Alerts />} />
               <Route path="/tarifarios" element={<Tarifarios />} />
               <Route path="/station/:stationId" element={<StationDetailWrapper />} />
               <Route path="/train/:trainId" element={<TrainDetailWrapper />} />
               <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
         </main>
         <Footer />
         </div>
      </Router>
   );
};

export default App;