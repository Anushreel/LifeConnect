// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Register from "./components/Register";
// import Login from "./components/Login";
// import { Layout } from 'antd';
// import { AuthProvider } from './contexts/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import HealthDashboard from "./components/LifeConnectDashboard";
// import UserProfile from "./components/UserProfile";
// import HealthCharts from "./components/HealthCharts";
// import EmployeeManagement from "./components/EmployeeManagement";
// import AdminPage from "./components/AdminPage";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Layout style={{ minHeight: '100vh' }}>
//           <Routes>
//             <Route path="/" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/mainpage" element={<HealthDashboard />} />
//             <Route path="/profile" element={<UserProfile />} />
//             <Route path="/charts" element={<HealthCharts />} />
//             {/* <Route path="/admin" element={<AdminPage />} /> */}
//             <Route 
//               path="/admin" 
//               element={
//                 <ProtectedRoute requireAdmin={true}>
//                   <AdminPage />
//                 </ProtectedRoute>
//               } 
//             />
//           </Routes>
//         </Layout>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import { Layout } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HealthDashboard from "./components/LifeConnectDashboard";
import UserProfile from "./components/UserProfile";
import HealthCharts from "./components/HealthCharts";
import AdminPage from "./components/AdminPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
            
            {/* Protected routes requiring authentication */}
            <Route 
              path="/mainpage" 
              element={
                <ProtectedRoute>
                  <HealthDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/charts" 
              element={
                <ProtectedRoute>
                  <HealthCharts />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin-only routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute  isAdminUser={true}>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route - redirect to home
            <Route path="*" element={<Navigate to="/" />} /> */}
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;