import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './CSS/App.css';

// Components
import Cart from "./components/Cart";
import AdminPage from './AdminPage';
import Login from './components/Login';
import Info from './components/Info';
import Navbar from './components/Navbar';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/info" element={<Info />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route element={<ProtectedRoute requireAdmin={false} />}>
              <Route path="/" element={<Cart />} />
            </Route>
            
            {/* Admin Routes - Require Admin Role */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminPage />} />
        
            
              
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
