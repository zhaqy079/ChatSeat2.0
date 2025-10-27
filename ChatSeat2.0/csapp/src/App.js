import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResetRequest from "./components/ResetRequest"
import Resetpassword from "./components/Resetpassword"
import Venues from "./components/Venues";
import AboutUs from "./components/AboutUs";

import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminSchedulingSetting from "./components/Admin/AdminSchedulingSetting";
import CoordinatorDashboard from "./components/Coordinator/CoordinatorDashboard";
import AdminViewUsers from "./components/Admin/AdminViewUsers";
import AdminManageUser from "./components/Admin/AdminManageUser";
import AdminHelp from "./components/Admin/AdminHelp";
import AdminListenerChatroom from "./components/Admin/AdminListenerChatroom";

import ListenerDashboard from "./components/Listener/ListenerDashboard";
import ListenerScheduling from "./components/Listener/ListenerScheduling";
//import ListenerSidebar from "./components/Listener/ListenerSideBar";
import CoordinatorsListInListener from "./components/Listener/CoordinatorsListInListener";
import ListenerChatroom from "./components/Listener/ListenerChatroom";
import ListenerHelp from "./components/Listener/ListenerHelp";
import PrivateMessage from "./components/Listener/Privatemessage";

import CoordinatorForum from "./components/Coordinator/CoordinatorForum";
import AdminFeedback from "./components/Admin/AdminFeedback";
import SubmitFeedback from "./components/Shared/SubmitFeedback";

import CoordinatorAppointments from "./components/Coordinator/CoordinatorAppointments";
import CoordinatorAvailability from "./components/Coordinator/CoordinatorAvailability";
import CoordinatorListenerChatroom from "./components/Coordinator/CoordinatorListenerChatroom";
import CoordinatorAddListener from "./components/Coordinator/CoordinatorAddListener"; 
import CoordinatorHelp from "./components/Coordinator/CoordinatorHelp";


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
                <Route path="/about" element={<AboutUs />} />

                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/adminSchedulingSetting" element={<AdminSchedulingSetting />} />
                <Route path="/adminlistenerchatroom" element={<AdminListenerChatroom />} />
                <Route path="/coordinatordashboard" element={<CoordinatorDashboard />} />
                <Route path="/coordinatorforum" element={<CoordinatorForum />} />
                <Route path="/adminViewUsers" element={<AdminViewUsers />} />
                <Route path="/adminhelp" element={<AdminHelp />} />
                
                <Route path="/listenerdashboard" element={<ListenerDashboard />} />
                <Route path="/listenerscheduling" element={<ListenerScheduling />} />
                <Route path="/coordinatorslistinlistener" element={< CoordinatorsListInListener />} />
                <Route path="/listenerchatroom" element={<ListenerChatroom />} />
                <Route path="/listenerhelp" element={<ListenerHelp />} />
                <Route path="/privatemessage" element={<PrivateMessage />} />

                <Route path="/adminFeedback" element={<AdminFeedback />} />
                <Route path="/submitFeedback" element={<SubmitFeedback />} />
                <Route path="/manageUser/:id" element={<AdminManageUser />} />

                <Route path="/coordinatorappointments" element={< CoordinatorAppointments />} />
                <Route path="/coordinatoravailability" element={< CoordinatorAvailability />} />
                <Route path="/coordinatoraddlistener" element={< CoordinatorAddListener />} />
                <Route path="/coordinatorchatroom" element={< CoordinatorForum />} />
                <Route path="/coordinatorlistenerchatroom" element={< CoordinatorListenerChatroom />} />
                <Route path="/coordinatorhelp" element={< CoordinatorHelp />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>

    );
}
