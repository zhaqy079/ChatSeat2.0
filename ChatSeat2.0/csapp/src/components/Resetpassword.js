import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

const schema = Yup.object().shape({
    password: Yup.string()
        .matches(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/,
            "Password must:\n- Be 8+ characters\n- Include uppercase & lowercase\n- Include number & special char (e.g. * & @ ?)"
        )
        .required("Password is required"),
});

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Effect to handle password reset link from URL hash
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
            supabase.auth
                .setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                })
                .then(({ error }) => {
                    if (error) {
                        setMessage("Session error: " + error.message);
                    }
                });
        } else {
            setMessage("Invalid or expired password reset link.");
        }
    }, []);

    // Function to handle password reset
    const handleReset = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) return setMessage("Reset failed: " + error.message);

        setMessage("Password updated successfully!");
        setTimeout(() => navigate("/Login"), 2000);
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <div className="flex-grow-1 d-flex align-items-center justify-content-center login-page">
                <div className="bg-white shadow p-4 p-md-5 rounded-3">
                    <h2 className="fw-bold text-center mb-4 intro-title warning">
                        Reset Password
                    </h2>

                    <form
                        onSubmit={handleResetRequest} noValidate>

                        <div className="mb-4">
                            <input
                                className="form-control p-3"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Password</label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control pe-5"
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                                    style={{ color: "#003366", textDecoration: "none" }}
                                    onClick={() => setShowPassword((s) => !s)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <p className="text-danger small">{errors.password?.message?.split("\n").map((line, idx) => (
                                <div key={idx}>{line}</div>
                            ))}</p>
                        </div>

                        <div className="text-center mt-4">
                            <button
                                type="submit"
                                className="btn w-100 fw-bold text-white login-btn"
                            >
                                Reset Password
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <a href="/login" className="btn btn-link p-0">
                                Back to Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

