// When user click "Forget Password" at the login page,
// after using enter their login account email, will send a password reset link to their email

import { useState } from "react";
//import supabase from "../supabase";
import { toast } from "react-toastify";

export default function ResetRequest() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    // Function to handle password reset request
    const handleResetRequest = async (e) => {
        e.preventDefault();
        // Supabase part may need update 
        //const { error } = await supabase.auth.resetPasswordForEmail(email, {
         //   redirectTo: "https://chatseats.com.au/reset-password",
       // });

        //setMessage(
        //    error
        //        ? "Error: " + error.message
        //        : "Password reset link sent to your email."
        //);
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <div className="flex-grow-1 d-flex align-items-center justify-content-center login-page">
                <div className="bg-white shadow p-4 p-md-5 rounded-3">
                    <h2 className="fw-bold text-center mb-4 intro-title">
                        Forget Password
                    </h2>

                    <form
                        onSubmit={handleResetRequest}>

                        <div className="mb-4">
                            <input
                                type="email"
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
                            >
                                Send Reset Link
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
