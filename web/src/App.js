import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import RFIDTest from './Pages/RFIDTest.jsx';
import Registration from './Pages/Registration.jsx';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';
import Dashboard from './Pages/Dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/rfidtest" element={<RFIDTest />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;