import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResetRequest from "./components/ResetRequest"
import ResetPassword from "./components/ResetPassword"
import Venues from "./components/Venues";
import AboutUs from "./components/AboutUs";

import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminSchedulingSetting from "./components/Admin/AdminSchedulingSetting";
import CoordinatorDashboard from "./components/Coordinator/CoordinatorDashboard";
import AdminViewUsers from "./components/Admin/AdminViewUsers";
import AdminManageUser from "./components/Admin/AdminManageUser";
import AdminHelp from "./components/Admin/AdminHelp";
import AdminEditResource from "./components/Admin/AdminEditResource";
import AdminListenerChatroom from "./components/Admin/AdminListenerChatroom";
import AdminCoordinatorChatroom from "./components/Admin/AdminCoordinatorChatroom";


import ListenerDashboard from "./components/Listener/ListenerDashboard";
import ListenerScheduling from "./components/Listener/ListenerScheduling";
import CoordinatorsListInListener from "./components/Listener/CoordinatorsListInListener";
import ListenerChatroom from "./components/Listener/ListenerChatroom";
import ListenerHelp from "./components/Listener/ListenerHelp";
import PrivateMessage from "./components/Listener/Privatemessage";
import ListeningSkills from "./components/Listener/ListeningSkills";
import ConversationSkills from "./components/Listener/ConversationSkills";
import MakePeopleComfortable from "./components/Listener/MakePeopleComfortable";

import CoordinatorAdminForum from "./components/Coordinator/CoordinatorAdminForum";
import AdminFeedback from "./components/Admin/AdminFeedback";
import SubmitFeedback from "./components/Shared/SubmitFeedback";

import CoordinatorAppointments from "./components/Coordinator/CoordinatorAppointments";
import CoordinatorAvailability from "./components/Coordinator/CoordinatorAvailability";
import CoordinatorListenerChatroom from "./components/Coordinator/CoordinatorListenerChatroom";
import CoordinatorHelp from "./components/Coordinator/CoordinatorHelp";
import CoordinatorFeedback from "./components/Coordinator/CoordinatorFeedback";
import ListenerFeedback from "./components/Listener/ListenerFeedback";

import ProtectedRoute from "./components/Context/ProctedRoutes";
import { AuthProvider } from "./components/Context/AuthContext.js";



export default function App() {
    useEffect(() => {
        Aos.init({ duration: 800, once: true, mirror: false });
    }, []);

    return (
        <Router>
            <ToastContainer position="top-center" autoClose={2000} />
            <Navbar />
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/resetrequest" element={<ResetRequest />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/venues" element={<Venues />} />
                    <Route path="/about" element={<AboutUs />} />



                    <Route element={<ProtectedRoute requiredRole="admin" />}>
                        <Route path="/admindashboard" element={<AdminDashboard />} />
                        <Route path="/adminSchedulingSetting" element={<AdminSchedulingSetting />} />
                        <Route path="/adminlistenerchatroom" element={<AdminListenerChatroom />} />
                        <Route path="/adminViewUsers" element={<AdminViewUsers />} />
                        <Route path="/adminhelp" element={<AdminHelp />} />
                        <Route path="/admineditresource" element={<AdminEditResource />} />
                        <Route path="/admincoordinatorchatroom" element={<AdminCoordinatorChatroom />} />
                        <Route path="/adminFeedback" element={<AdminFeedback />} />
                        <Route path="/manageUser/:id" element={<AdminManageUser />} />
                    </Route>



                    <Route element={<ProtectedRoute requiredRole="listener" />}>
                        <Route path="/listenerdashboard" element={<ListenerDashboard />} />
                        <Route path="/listenerscheduling" element={<ListenerScheduling />} />
                        <Route path="/coordinatorslistinlistener" element={<CoordinatorsListInListener />} />
                        <Route path="/listenerchatroom" element={<ListenerChatroom />} />
                        <Route path="/listenerhelp" element={<ListenerHelp />} />
                        <Route path="/privatemessage" element={<PrivateMessage />} />
                        <Route path="/listeningskills" element={<ListeningSkills />} />
                        <Route path="/conversationskills" element={<ConversationSkills />} />
                        <Route path="/makepeoplecomfortable" element={<MakePeopleComfortable />} />
                        <Route path="/listenerFeedback" element={<ListenerFeedback />} />
                    </Route>


                    <Route element={<ProtectedRoute requiredRole="coordinator" />}>
                        <Route path="/coordinatordashboard" element={<CoordinatorDashboard />} />
                        <Route path="/coordinatorappointments" element={< CoordinatorAppointments />} />
                        <Route path="/coordinatoravailability" element={< CoordinatorAvailability />} />
                        <Route path="/coordinatoradminforum" element={< CoordinatorAdminForum />} />
                        <Route path="/coordinatorlistenerchatroom" element={< CoordinatorListenerChatroom />} />
                        <Route path="/coordinatorhelp" element={< CoordinatorHelp />} />
                        <Route path="/coordFeedback" element={<CoordinatorFeedback />} />
                    </Route>


                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>

        </Router>

    );
}
