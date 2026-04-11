import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import RFIDTest from './Pages/RFIDTest.jsx';
import Registration from './Pages/Registration.jsx';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from './Components/ProtectedRouteComponent.jsx';
import PublicRoute from './Components/PublicRoute.jsx';


function App() {
  return (
    <AuthProvider> {/* ✅ WRAP EVERYTHING */}
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Registration /></PublicRoute>} />
          <Route path="/rfidtest" element={<RFIDTest />} />

          {/* 🔐 PROTECTED ROUTE */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;