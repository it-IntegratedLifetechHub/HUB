import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AutoScroll from "./components/AutoScroll";
import Patient from "./pages/Patient";
import Hub from "./pages/Hub";
import Lab from "./pages/Lab";
import Compounder from "./pages/Compounder";
import SingleService from "./pages/SingleService";
import SingleTest from "./pages/SingleTest";

const App = () => {
  return (
    <BrowserRouter>
      <AutoScroll />

      <Routes>
        <Route path="/patient" element={<Patient />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/compounder" element={<Compounder />} />
        <Route path="/service/:serviceName" element={<SingleService />} />
        <Route path="/service/:serviceName/:test" element={<SingleTest />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
