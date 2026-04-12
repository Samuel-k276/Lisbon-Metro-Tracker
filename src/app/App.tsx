import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/features/map/Home";
import { Header } from "@/layout/Header";
import { Footer } from "@/layout/Footer";
import { StationDetail } from "@/features/stations/StationDetail";
import { TrainDetail } from "@/features/trains/TrainDetail";
import { Alerts } from "@/features/alerts/Alerts";
import { Sobre } from "@/features/about/Sobre";
import { Tarifarios } from "@/features/fares/Tarifarios";
import { PlanearViagem } from "@/features/planner/PlanearViagem";
import { TrainProvider } from "@/shared/contexts/TrainContext";

const App: React.FC = () => {
  return (
    <Router>
      <TrainProvider>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/alertas" element={<Alerts />} />
              <Route path="/tarifarios" element={<Tarifarios />} />
              <Route path="/planear-viagem" element={<PlanearViagem />} />
              <Route path="/station/:stationId" element={<StationDetail />} />
              <Route path="/train/:trainId" element={<TrainDetail />} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </TrainProvider>
    </Router>
  );
};

export { App };
