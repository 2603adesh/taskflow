import { useState } from 'react';
import {BrowserRouter, Routes, Route, Navigate}from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicRoutes from './components/PublicRoutes';
import ProtectedRoutes from './components/ProtectedRoute';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' 
      element = {
      <PublicRoutes>
      {<Login/>} 
      </PublicRoutes>
      }
      />
      <Route path='/register' 
      element = {
        <PublicRoutes>
        <Register/>
        </PublicRoutes>
        } />
      <Route path='/dashboard' 
      element = {
        <ProtectedRoutes>
        <Dashboard/>
        </ProtectedRoutes>
        } />
      <Route path='*' element = {<Navigate to = "/login"/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
