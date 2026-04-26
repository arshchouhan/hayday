import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
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
            <Route path="/home" element={<LandingPage />} />
            <Route path="/lifecycle/*" element={<Dashboard />} />
            <Route path="/health/*" element={<Dashboard />} />
            <Route path="/breeding/*" element={<Dashboard />} />
            <Route path="/location/*" element={<Dashboard />} />
            <Route path="/pedigree/*" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
