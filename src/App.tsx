import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Web3Provider } from './context/Web3Context';
import Header from './components/Header';
import Home from './pages/Home';
import RegisterVoter from './pages/RegisterVoter';
import RegisterCandidate from './pages/RegisterCandidate';
import Vote from './pages/Vote';
import Results from './pages/Results';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register-voter" element={<RegisterVoter />} />
              <Route path="/register-candidate" element={<RegisterCandidate />} />
              <Route path="/vote" element={<Vote />} />
              <Route path="/results" element={<Results />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </Web3Provider>
  );
};

export default App;
