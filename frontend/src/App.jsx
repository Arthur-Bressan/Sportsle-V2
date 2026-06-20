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
  );
}