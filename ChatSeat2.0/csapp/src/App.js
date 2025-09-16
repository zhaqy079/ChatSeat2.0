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
import AdminViewUsers from "./components/Admin/AdminViewUsers";
import AdminManageLocations from "./components/Admin/AdminManageLocations";
import ListenerDashboard from "./components/Listener/ListenerDashboard";
import ListenerScheduling from "./components/Listener/ListenerScheduling";
import ListenerSidebar from "./components/Listener/ListenerSideBar";
import CoordinatorsListInListener from "./components/Listener/CoordinatorsListInListener";

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
                <Route path="/adminViewUsers" element={<AdminViewUsers />} />
                <Route path="/adminManageLocations" element={<AdminManageLocations />} />
                <Route path="/listenerdashboard" element={<ListenerDashboard />} />
                <Route path="/listenerscheduling" element={<ListenerScheduling />} />
                <Route path="/coordinatorslistinlistener" element={< CoordinatorsListInListener />} />
               
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
