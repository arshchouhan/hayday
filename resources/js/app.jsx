import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Farm from "./pages/Farm";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#D7E3EF]">
        <div className="text-[15px] font-black text-[#1a1a2e] animate-pulse">Loading HayDay...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (user) {
    return <Navigate to="/farm" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/login" 
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <GuestRoute>
                  <Signup />
                </GuestRoute>
              } 
            />
            
            {/* Protected Application Routes */}
            <Route 
              path="/farm/*" 
              element={
                <ProtectedRoute>
                  <Farm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/health/*" 
              element={
                <ProtectedRoute>
                  <Farm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lifecycle/*" 
              element={
                <ProtectedRoute>
                  <Farm />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/home" element={<LandingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
