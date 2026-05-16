import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import RFIDScan from './Pages/RFIDScan.jsx';
import Registration from './Pages/Registration.jsx';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';
import DashboardLayout from './Pages/DashboardLayout.jsx';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from './Components/ProtectedRouteComponent.jsx';
import PublicRoute from './Components/PublicRoute.jsx';
import DashboardHome from './Pages/DashboardHome.jsx';
import BorrowedBook from './Pages/BorrowedBook.jsx';
import Notifications from './Pages/Notifications.jsx';
import LibraryCatalogue from './Pages/LibraryCatalogue.jsx';
import AddBook from './Pages/AddBook.jsx';
import Statistics from './Pages/Statistics.jsx';
import ManageUsers from './Pages/ManageUsers.jsx';
import AdminRoute from './Components/AdminRoute.jsx';
import PenaltyHistory from './Pages/PenaltyHistory.jsx';
import BorrowReturnManager from './Pages/BorrowReturnManager.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer /> 
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Registration /></PublicRoute>} />

          {/* PROTECTED ROUTE */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="rfidscan" element={<RFIDScan />} />
            <Route path="borrowed-books" element={<BorrowedBook />} />
            <Route path="catalogue" element={<LibraryCatalogue />} />
            <Route path="notifications" element={<Notifications />} />

            <Route path="add-book" element={<AdminRoute><AddBook /></AdminRoute>} />
            <Route path="statistics" element={<AdminRoute><Statistics /></AdminRoute>} />
            <Route path="manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
            <Route path="penalty-history" element={<AdminRoute><PenaltyHistory /></AdminRoute>} />
            <Route path="borrow-return-manager" element={<AdminRoute><BorrowReturnManager /></AdminRoute>} />

          </Route>

        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;