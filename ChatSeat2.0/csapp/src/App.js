import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResetRequest from "./components/ResetRequest"
import Venues from "./components/Venues";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminSchedulingSetting from "./components/Admin/AdminSchedulingSetting";



export default function App() {
    return (
        <Router>
            <ToastContainer position="top-center" autoClose={2000} />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/resetrequest" element={<ResetRequest/>} />
                <Route path="/venues" element={<Venues />} />
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/adminSchedulingSetting" element={<AdminSchedulingSetting />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
