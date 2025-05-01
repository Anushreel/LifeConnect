import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
// import MainPage from "./components/MainPage";
import HealthDashboard from "./components/LifeConnectDashboard";
import UserProfile from "./components/UserProfile";
import HealthCharts from "./components/HealthCharts";
// lifeconnect\src\components\HealthCharts.js
import EmployeeManagement from "./components/EmployeeManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mainpage" element={<HealthDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/charts" element={<HealthCharts />} />
        <Route path="/admin" element={<EmployeeManagement/>}/>
      </Routes>
    </Router>
  );
}

export default App;


