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
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
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
                    <h2 className="fw-bold text-center mb-4 intro-title">
                        Reset Password
                    </h2>
                    {message && <p className="mb-4 text-danger">{message}</p>}
                    <form
                        onSubmit={handleReset}>
                        <div className="row">
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className=" p-3 border border-gray-300 rounded mb-4"
                                required
                            />
                        </div>
                        <div className="row">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Reset Password
                            </button>
                        </div>
                        
                    </form>
                </div>
            </div>
      </div>
    );
}