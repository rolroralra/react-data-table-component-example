import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import BrandApp from './brand/BrandApp';
import ItemApp from './item/ItemApp';
import Page1 from './statistics/page1';
import Page2 from './statistics/page2';
import Page3 from './statistics/page3';


function App() {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/page1" element={<BrandApp />} />
            <Route path="/page2" element={<ItemApp />} />
            <Route path="/page3" element={<Page1 />} />
            <Route path="/page4" element={<Page2 />} />
            <Route path="/page5" element={<Page3 />} />
          </Routes>
        </div>
      </Router>
    );
  }

export default App;
