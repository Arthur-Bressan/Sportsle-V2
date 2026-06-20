<<<<<<< HEAD
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GamePage from './pages/GamePage';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </div>
=======
// frontend/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game/Game";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
      </Routes>
    </BrowserRouter>
>>>>>>> 181d81ad42c07ee0bdc0b2d1d872276ce284bb27
  );
}