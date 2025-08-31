import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


export default function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ email: "", password: ""}); // Combined to make more practical and streamlined
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Pop up for incomplete fields
        if (!email || !password) {
            toast.warn("Please enter email and password.");
            return;
        }

        setLoading(true);
        try {
            // Sign in with Supabase authentication
            const { data: authData, error: authError } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
            console.log('authData:', authData);
            if (authError) throw authError;

            // Retrieve user data for redirection via role
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", authData.user.id)
                .single();

            if (profileError) throw profileError;

            // Store user session info for protected routes
            localStorage.setItem("userRole", profileData.role);

            if (profileData.role !== "pending") { 
                toast.success("Login successful!");
            } else {
                toast.warning("Awaiting approval");
            }

            // Navigation for specfic user role
            // TO BE COMPLETED
            localStorage.setItem("userRole", profileData.role);

            // Redirect based on role
            if (profileData.role === "admin") {
                navigate("/admindashboard");
            } else if (profileData.role === "coordinator") {
                navigate("/coordinatordashboard");
            } else if (profileData.role === "listener") {
                navigate("/listenerdashboard");
            } else {
                navigate("/"); 
            }

        } catch {
            toast.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const [profiles, setProfiles] = useState([]);




    return (
        <div className="min-vh-100 d-flex flex-column">
            <div className="flex-grow-1 d-flex align-items-center justify-content-center login-page">
                <div className="bg-white shadow p-4 p-md-5 rounded-3">
                    <h2 className="fw-bold text-center mb-4 intro-title">
                        Log In
                    </h2>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Password</label>
                            <div className="position-relative">
                                <input
                                    type={show ? "text" : "password"}
                                    className="form-control pe-5"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                                    style={{ color: "#003366", textDecoration: "none" }}
                                    onClick={() => setShow((s) => !s)}
                                >
                                    {show ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 fw-bold text-white mb-3 login-btn"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mt-3 ">
                            <button type="button" className="btn btn-link p-0 back-btn" onClick={() => navigate("/")}>
                                Back to Home
                            </button>
                            <button type="button" className="btn btn-link p-0 signup-btn" onClick={() => navigate("/signup")}>
                                Sign Up
                            </button>
                        </div>

                        <div className="text-center mt-3">
                            <button type="button" className="btn btn-link p-0" onClick={() => navigate("/resetrequest")} >
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
