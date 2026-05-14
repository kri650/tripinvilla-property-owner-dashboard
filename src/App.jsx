import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OwnerLayout from './layouts/OwnerLayout';
import MyProperties from './pages/MyProperties';
import PropertyRequests from './pages/PropertyRequests';
import OffersByDate from './pages/OffersByDate';
import Enquiries from './pages/Enquiries';
import Premium from './pages/Premium';
import LogOut from './pages/LogOut';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<Navigate to="properties" replace />} />
          <Route path="properties" element={<MyProperties />} />
          <Route path="requests" element={<PropertyRequests />} />
          <Route path="offers" element={<OffersByDate />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="premium" element={<Premium />} />
          <Route path="logout" element={<LogOut />} />
        </Route>
        <Route path="*" element={<Navigate to="/owner/properties" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
