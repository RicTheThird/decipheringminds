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
import CalendarAdmin from "./components/calendar-admin";
import PsychResult from "./components/psych-results";
import QuestionnairePatient from "./components/questionnaire-patient";
import Patients from "./components/patients";
import Meeting from "./components/meeting";
import Chat from "./components/chat";
import ChatAdminView from "./components/chat-admin";
import ForgotPassword from "./components/forgot-password";
import UserManagement from "./components/user-management";
import StaffRegister from "./components/staff-registration";

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
  const hideDrawerRoutes = ["/login", "/register", "/dashboard", "/forgot-password", "/staff-register"];

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
        <Route path="/staff-register" element={<StaffRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        {/* Main Dashboard Route with Child Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* <Route path="/dashboard/*" element={<Dashboard />}> */}
          <Route path="home" element={<DashboardHome />} />
          <Route path="questionnaire" element={<Questionnaire />} />
          <Route path="questionnaire-user" element={<QuestionnairePatient />} />
          <Route path="diagnostic" element={<Diagnostic />} />
          <Route path="psych-report" element={<PyschReport />} />
          <Route path="psych-result" element={<PsychResult />} />
          <Route path="calendar" element={<BookingCalendar />} />
          <Route path="admin-calendar" element={<CalendarAdmin />} />
          <Route path="profile" element={<Profile />} />
          <Route path="patient" element={<Patients />} />
          <Route path="meeting" element={<Meeting />} />
          <Route path="chat-view" element={<ChatAdminView />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
