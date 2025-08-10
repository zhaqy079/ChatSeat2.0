import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
//import Venues from "./components/Venues";

/*Placeholder, need one teammate done (I think TO Jordon ^^ cause Callum will do supabase stuff)
if you want to achieve this feature,
please create a branch name feature-Venues, then start work on it,
Please dont update App.js or index.js file, in case too many conflit
( when you push please make sure this App.js keep like this)
*/
function Venues() {
    return (
        <div className="container py-5">
            <h2 className="mb-3">Available Venues</h2>
            <p>Update later....</p>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <ToastContainer position="top-center" autoClose={2000} />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/venues" element={<Venues />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
