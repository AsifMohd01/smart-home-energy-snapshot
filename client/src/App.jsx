// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
// import Login from "./pages/Login"
// import Register from "./pages/Register"
// import Dashboard from "./pages/Dashboard"
// import Devices from "./pages/Devices"
// import Budget from "./pages/Budget"
// import Layout from "./components/Layout"

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         <Route element={<Layout />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/devices" element={<Devices />} />
//           <Route path="/budget" element={<Budget />} />
//         </Route>
//       </Routes>
//     </Router>
//   )
// }

// export default App

//another code

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Budget from "./pages/Budget";
import Layout from "./components/Layout";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login initially */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes inside Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/budget" element={<Budget />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
