import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage'; // Adjust path if Homepage.js is inside 'components'
import CombinedAuth from './components/CombinedAuth'; // Adjust path if CombinedAuth.js is inside 'components'
import BillSplitting from './components/BillSplitting'; // Adjust if the path is different
import Navbar from './components/Navbar'; // Adjust path if Navbar.js is inside 'components'
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth" element={<CombinedAuth />} />
        <Route path="/split" element={<BillSplitting />} />
      </Routes>
    </div>
  );
}

export default App;
