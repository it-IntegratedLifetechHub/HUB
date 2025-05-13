import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AutoScroll from "./components/AutoScroll";

// Patient Pages
import Home from "./pages/Patient/Home";
import SingleService from "./pages/Patient/SingleService";
import SingleTest from "./pages/Patient/SingleTest";
import Orders from "./pages/Patient/Orders";
import Report from "./pages/Patient/Report";
import Profile from "./pages/Patient/Profile";
import PatientRegistration from "./pages/Patient/PatientRegistration";
import PatientLogin from "./pages/Patient/PatientLogin";

// Other Role Pages
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
import Book from "./pages/Patient/Book";
import Payment from "./components/Payement";
import Services from "./pages/Hub/Services";
import AddCategory from "./pages/Hub/AddCategory";
import AddTest from "./pages/Hub/AddTest";
import ProtectedRoute from "./pages/Hub/ProtectedRoute";

import HubRegistration from "./pages/Hub/HubRegistration";
import HubLogin from "./pages/Hub/HubLogin";

const RefreshHandler = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      if (
        location.pathname === "/" ||
        location.pathname === "/patient/login" ||
        location.pathname === "/patient/registration"
      ) {
        navigate("/patient", { replace: true });
      }
    } else {
      setIsAuthenticated(false);
      if (
        location.pathname.startsWith("/patient") &&
        !["/patient/login", "/patient/registration"].includes(location.pathname)
      ) {
        navigate("/patient/login", { replace: true });
      }
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
};

const PatientRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/patient/login" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <AutoScroll />
      <Routes>
        {/* ~~~~~~  PATIENT Routes  ~~~~~~ */}
        <Route path="/patient/registration" element={<PatientRegistration />} />
        <Route
          path="/patient/login"
          element={<PatientLogin setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route
          path="/patient"
          element={
            <PatientRoute
              element={<Home />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/category/:categoryId"
          element={
            <PatientRoute
              element={<SingleService />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/category/:categoryId/test/:test"
          element={
            <PatientRoute
              element={<SingleTest />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/booking/:categoryId/test/:test"
          element={
            <PatientRoute
              element={<Book />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/payment/:orderId"
          element={
            <PatientRoute
              element={<Payment />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <PatientRoute
              element={<Orders />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/report"
          element={
            <PatientRoute
              element={<Report />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <PatientRoute
              element={<Profile />}
              isAuthenticated={isAuthenticated}
            />
          }
        />

        {/* ~~~~~~  HUB Routes  ~~~~~~ */}
        <Route path="/hub/registration" element={<HubRegistration />} />
        <Route path="/hub/login" element={<HubLogin />} />

        <Route
          path="/hub/dashboard"
          element={
            <ProtectedRoute>
              <HubDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hub/orders"
          element={
            <ProtectedRoute>
              <HubOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hub/assignment"
          element={
            <ProtectedRoute>
              <HubAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hub/track"
          element={
            <ProtectedRoute>
              <HubTrack />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hub/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hub/addcat"
          element={
            <ProtectedRoute>
              <AddCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hub/addtest/:categoryId"
          element={
            <ProtectedRoute>
              <AddTest />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/patient" replace />} />

         {/* Other Role Routes */}
        <Route path="/phlebotomist/dashboard" element={<Phlebotomist />} />
        <Route path="/phlebotomist/task" element={<PhlebotomistTask />} />
        <Route path="/phlebotomist/profile" element={<PhlebotomistProfile />} />
        <Route path="/lab/dashboard" element={<Lab />} />
        <Route path="/lab/test" element={<LabTest />} />
        <Route path="/lab/report" element={<LabReport />} />
        <Route path="/lab/profile" element={<LabProfile />} />

        {/* 404 Route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
