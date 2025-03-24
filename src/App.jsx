import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Patient from "./pages/Patient";
import Hub from "./pages/Hub";
import Lab from "./pages/Lab";
import Compounder from "./pages/Compounder";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/patient" element={<Patient />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/compounder" element={<Compounder />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
