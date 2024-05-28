import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Table from './Table';
import ItemApp from './item/ItemApp';

function App() {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/page1" element={<Table />} />
            <Route path="/page2" element={<ItemApp />} />
          </Routes>
        </div>
      </Router>
    );
  }

export default App;
