// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Headers from "./components/header";
import Home from "./pages/home";
import Login from "./components/login";
import Register from "./components/registration";
import Dashboard from "./pages/dashboard";
import DashboardHome from "./components/dashboard-home";
import Profile from "./components/profile";
import Questionnaire from "./components/questionnaire";
import Diagnostic from "./components/diagnostic";
import PyschReport from "./components/psych-report";
import BookingCalendar from "./components/calendar";
import QuestionnaireForm from "./components/questionnaire-form";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <MainRoutes />
      </Router>
    </>
  );
};

// Create a component to handle route-specific layout
const MainRoutes: React.FC = () => {
  const location = useLocation();

  // Conditionally show the DrawerMenu for routes that are not login or register
  const hideDrawerRoutes = ["/login", "/register", "/dashboard"];

  return (
    <>
      {/* Conditionally render the DrawerMenu based on the route */}
      {!hideDrawerRoutes.some((route) => location.pathname.includes(route)) && (
        <Headers />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        {/* Main Dashboard Route with Child Routes */}
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="home" element={<DashboardHome />} />
          <Route path="questionnaire" element={<Questionnaire />} />
          <Route path="diagnostic" element={<Diagnostic />} />
          <Route path="psych-report" element={<PyschReport />} />
          <Route path="calendar" element={<BookingCalendar />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
