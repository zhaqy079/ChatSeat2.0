import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ResetRequest() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [cooldown, setCooldown] = useState(0);


    // Function to handle password reset request
    const handleResetRequest = async (e) => {
        e.preventDefault();
        if (cooldown > 0) return;

        document.getElementById("resetSubmit").disabled = true;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "https://chatseats.com.au/reset-password",
        });

        setMessage(
            error
                ? "Error: " + error.message
                : "Password reset link sent to your email."
        );

        document.getElementById("resetSubmit").disabled = false;
    };

    useState(() => {
        if (!cooldown) return;
        const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
        return () => clearInterval(t);
    }, [cooldown]);


    return (
        <div className="min-vh-100 d-flex flex-column">
            <div className="flex-grow-1 d-flex align-items-center justify-content-center login-page">
                <div className="bg-white shadow p-4 p-md-5 rounded-3">
                    <h2 className="fw-bold text-center mb-4 intro-title">
                        Reset Request
                    </h2>

                    <form
                        onSubmit={handleResetRequest}>

                        <div className="mb-4">
                            <input
                                type="email"
                                name="enterEmail"
                                autoComplete="email"
                                className="form-control p-3 rounded"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>  

                        <div className="text-center mt-4">
                            <button
                                type="submit"
                                className="btn w-100 fw-bold text-white login-btn"
                                id="resetSubmit"
                                disabled={cooldown > 0}
                            >
                                {cooldown > 0 ? `Resend in ${cooldown}s` : "Send Reset Link"}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <a href="/login" className="btn btn-link p-0">
                                Back to Login
                            </a>
                        </div>
                        {message && <p className="mt-4 text-center">{message}</p>}
                    </form>
                </div>
            </div>
      </div>
    );
}
