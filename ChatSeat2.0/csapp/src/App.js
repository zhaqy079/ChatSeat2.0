import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResetRequest from "./components/ResetRequest"
import Resetpassword from "./components/Resetpassword"
import Venues from "./components/Venues";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminSchedulingSetting from "./components/Admin/AdminSchedulingSetting";
import CoordinatorDashboard from "./components/Coordinator/CoordinatorDashboard";
import AdminViewUsers from "./components/Admin/AdminViewUsers";
import AdminManageLocations from "./components/Admin/AdminManageLocations";
import AdminManageUser from "./components/Admin/AdminManageUser";
import UserGeneralForum from "./components/Shared/UserGeneralForum";
import CoordinatorForum from "./components/Coordinator/CoordinatorForum";
import AdminFeedback from "./components/Admin/AdminFeedback";



export default function App() {
    return (
        <Router>
            <ToastContainer position="top-center" autoClose={2000} />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/resetrequest" element={<ResetRequest />} />
                <Route path="/reset-password" element={<Resetpassword />} />
                <Route path="/venues" element={<Venues />} />
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/adminSchedulingSetting" element={<AdminSchedulingSetting />} />
                <Route path="/coordinatordashboard" element={<CoordinatorDashboard />} />
                <Route path="/coordinatorforum" element={<CoordinatorForum />} />
                <Route path="/adminViewUsers" element={<AdminViewUsers />} />
                <Route path="/adminManageLocations" element={<AdminManageLocations />} />
                <Route path="/userGeneralForums" element={<UserGeneralForum />} />
                <Route path="/adminFeedback" element={<AdminFeedback />} />
                <Route path="/manageUser/:id" element={<AdminManageUser />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
