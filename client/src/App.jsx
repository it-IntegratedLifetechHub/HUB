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

import ProtectedRouteLab from "./pages/Lab/ProtectedRoute";
import LabLogin from "./pages/Lab/LabLogin";
import LabRegistration from "./pages/Lab/LabRegistration";
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
import HomeDoctor from "./pages/Patient/HomeDoctor";
import EmergencyRes from "./pages/Patient/EmergencyRes";
import Hospitals from "./pages/Patient/Hospitals";

import DoctorDashboard from "./pages/Doctor/Dashboard";
import DoctorAppointments from "./pages/Doctor/Appointments";
import DoctorPatients from "./pages/Doctor/Patients";
import DoctorPrescriptions from "./pages/Doctor/Prescriptions";
import DoctorProfile from "./pages/Doctor/Profile";
import DoctorLogin from "./pages/Doctor/Login";
import DoctorRegistration from "./pages/Doctor/Registration";

import MobileLogin from "./pages/MobileHospital/Login";
import MobileRegistration from "./pages/MobileHospital/Registration";
import MobileDashboard from "./pages/MobileHospital/Dashboard";
import MobilePatients from "./pages/MobileHospital/Patients";
import MobileHospitals from "./pages/MobileHospital/Hospitals";
import MobileProfile from "./pages/MobileHospital/Profile";

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
          path="/hospitals"
          element={
            <PatientRoute
              element={<Hospitals />}
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

        <Route
          path="/doctor-visit"
          element={
            <PatientRoute
              element={<HomeDoctor />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/emergency-response"
          element={
            <PatientRoute
              element={<EmergencyRes />}
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

        <Route path="/lab/login" element={<LabLogin />} />
        <Route path="/lab/registration" element={<LabRegistration />} />

        {/* Protected Lab Routes */}
        <Route
          path="/lab/dashboard"
          element={
            <ProtectedRouteLab>
              <Lab />
            </ProtectedRouteLab>
          }
        />
        <Route
          path="/lab/test"
          element={
            <ProtectedRouteLab>
              <LabTest />
            </ProtectedRouteLab>
          }
        />
        <Route
          path="/lab/report"
          element={
            <ProtectedRouteLab>
              <LabReport />
            </ProtectedRouteLab>
          }
        />
        <Route
          path="/lab/profile"
          element={
            <ProtectedRouteLab>
              <LabProfile />
            </ProtectedRouteLab>
          }
        />

        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/registration" element={<DoctorRegistration />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/patients" element={<DoctorPatients />} />
        <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />

        <Route path="/mobile-hospital/login" element={<MobileLogin />} />
        <Route
          path="/mobile-hospital/registration"
          element={<MobileRegistration />}
        />
        <Route
          path="/mobile-hospital/dashboard"
          element={<MobileDashboard />}
        />
        <Route path="/mobile-hospital/patients" element={<MobilePatients />} />
        <Route
          path="/mobile-hospital/hospitals"
          element={<MobileHospitals />}
        />
        <Route path="/mobile-hospital/profile" element={<MobileProfile />} />

        {/* 404 Route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
