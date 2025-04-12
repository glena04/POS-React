import React from "react";
import './CSS/App.css';
import Cart from "./components/Cart";
import AdminPage from './AdminPage';  // Ensure this path is correct
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Cart />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



