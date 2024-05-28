import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Table from './Table';
import Home from './Home';

function App() {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/page1" element={<Table />} />
          </Routes>
        </div>
      </Router>
    );
  }

export default App;
