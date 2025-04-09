import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import StationDetail from './pages/StationDetail';
import Alerts from './pages/Alerts';
import './App.css';

// Wrapper component to extract URL parameters
const StationDetailWrapper: React.FC = () => {
   const { stationId } = useParams<{ stationId: string }>();
   return stationId ? <StationDetail stationId={stationId} /> : <div>Station ID not found</div>;
};

const App: React.FC = () => {
   return (
      <Router>
         <div className="app">
         <Header />
         <main className="main-content">
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/alertas" element={<Alerts />} />
               <Route path="/station/:stationId" element={<StationDetailWrapper />} />
               <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
         </main>
         <Footer />
         </div>
      </Router>
   );
};

export default App;