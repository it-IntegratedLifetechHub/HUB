import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AutoScroll from "./components/AutoScroll";

import Home from "./pages/Patient/Home";
import SingleService from "./pages/Patient/SingleService";
import SingleTest from "./pages/Patient/SingleTest";
import Orders from "./pages/Patient/Orders";
import Report from "./pages/Patient/Report";
import Profile from "./pages/Patient/Profile";

import Hub from "./pages/Hub";
import Lab from "./pages/Lab";
import Compounder from "./pages/Compounder";
import EditProfile from "./components/EditProfile";

const App = () => {
  return (
    <BrowserRouter>
      <AutoScroll />

      <Routes>
        <Route path="/patient" element={<Home />} />
        <Route path="/service/:serviceName" element={<SingleService />} />
        <Route path="/service/:serviceName/:test" element={<SingleTest />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/report" element={<Report />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-field" element={<EditProfile />} />

        <Route path="/hub" element={<Hub />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/compounder" element={<Compounder />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
