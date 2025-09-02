import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import supabase from "../supabase";
// Please update supabase logic

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
}

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
                            type="email"
                            className="form-control p-3"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
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

