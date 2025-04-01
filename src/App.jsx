import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AutoScroll from "./components/AutoScroll";

import Home from "./pages/Patient/Home";
import SingleService from "./pages/Patient/SingleService";
import SingleTest from "./pages/Patient/SingleTest";
import Orders from "./pages/Patient/Orders";
import Report from "./pages/Patient/Report";
import Profile from "./pages/Patient/Profile";

import Phlebotomist from "./pages/Phlebotomist/Dashboard";
import PhlebotomistTask from "./pages/Phlebotomist/Task";
import PhlebotomistProfile from "./pages/Phlebotomist/Profile";

import Lab from "./pages/Lab/Dashboard";
import LabTest from "./pages/Lab/Test";
import LabReport from "./pages/Lab/Reports";
import LabProfile from "./pages/Lab/Profile";

import HubDashboard from "./pages/Hub/Dashboard";
import HubOrders from "./pages/Hub/Orders";
import HubAssignment from "./pages/Hub/Assignment";
import HubTrack from "./pages/Hub/Track";

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

        <Route path="/phlebotomist/dashboard" element={<Phlebotomist />} />
        <Route path="/phlebotomist/task" element={<PhlebotomistTask />} />
        <Route path="/phlebotomist/profile" element={<PhlebotomistProfile />} />

        <Route path="/lab/dashboard" element={<Lab />} />
        <Route path="/lab/test" element={<LabTest />} />
        <Route path="/lab/report" element={<LabReport />} />
        <Route path="/lab/profile" element={<LabProfile />} />

        <Route path="/hub/dashboard" element={<HubDashboard />} />
        <Route path="/hub/orders" element={<HubOrders />} />
        <Route path="/hub/assignment" element={<HubAssignment />} />
        <Route path="/hub/track" element={<HubTrack />} />

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
