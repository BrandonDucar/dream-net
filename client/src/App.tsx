
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Agents from './pages/Agents';
import Telemetry from './pages/Telemetry';
import DreamScopeWidget from './components/DreamScopeWidget';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/agents">Agents</Link>
            </li>
            <li>
              <Link to="/telemetry">Telemetry</Link>
            </li>
          </ul>
        </nav>
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/telemetry" element={<Telemetry />} />
          </Routes>
        </main>
        <footer className="p-4 bg-gray-200">
          <DreamScopeWidget />
        </footer>
      </div>
    </Router>
  );
};

export default App;
