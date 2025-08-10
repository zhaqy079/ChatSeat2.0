import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar"; 

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // mock validation
        if (!email || !pwd) {
            toast.warn("Please enter email and password.");
            return;
        }

        setLoading(true);
        try {
            // Need update supabase(TO Callum ^^ please create a branch name : feature/login-supabase ? or someelse better one 
            await new Promise((r) => setTimeout(r, 600));

            toast.success("Login successful (mock)");
            
            navigate("/"); // based on account info allocate page or other logic 
        } catch {
            toast.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <div className="flex-grow-1 d-flex align-items-center justify-content-center login-page">
                <div className="bg-white shadow p-4 p-md-5 rounded-3">
                    <h2 className="fw-bold text-center mb-4 intro-title">
                        Login
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
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
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
                            <button type="button" className="btn btn-link p-0" onClick={() => navigate("/resetpassword")} >
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
