import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import NavGestor from './Pages/NavGestor';
import NavRequisitor from './Pages/NavRequisitor';
import { useAuth } from './hooks/context';
import { ToastContainer, toast } from 'react-toastify'; // Importe o ToastContainer e toast
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { authenticated, userType } = useAuth();
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path='/' element={authenticated ? (userType === 1 ? <Navigate to="/navGestor" /> : userType === 2 ? <Navigate to="/navRequisitor" /> : <Login />) : <Login />} />
            <Route path='/navGestor' element={<NavGestor />} />
            <Route path='/navRequisitor' element={<NavRequisitor />} />
            <Route path='*' element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </Router>
      <ToastContainer /> {/* Adicione o ToastContainer aqui */}
    </div>
  );
}

export default App;
