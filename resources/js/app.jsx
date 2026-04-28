import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Farm from "./pages/Farm";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/farm" replace />} />
            <Route path="/farm" element={<Farm />} />
            <Route path="/farm/*" element={<Farm />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/health" element={<Farm />} />
            <Route path="/health/*" element={<Farm />} />
            <Route path="/breeding" element={<Farm />} />
            <Route path="/breeding/*" element={<Farm />} />
            <Route path="/pedigree" element={<Farm />} />
            <Route path="/pedigree/*" element={<Farm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
