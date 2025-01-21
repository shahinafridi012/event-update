import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './Components/Home/Home.jsx';
import Admin from './Components/Admin/Admin.jsx';
import Admin_login from './Components/Admin/Admin_login.jsx';
import PrivateRoutes from './Components/privateRoutes.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<PrivateRoutes><Admin /></PrivateRoutes>} />
        <Route path="/admin-login" element={<Admin_login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
