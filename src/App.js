import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import BrandApp from './brand/BrandApp';
import ItemApp from './item/ItemApp';

function App() {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/page1" element={<BrandApp />} />
            <Route path="/page2" element={<ItemApp />} />
          </Routes>
        </div>
      </Router>
    );
  }

export default App;
