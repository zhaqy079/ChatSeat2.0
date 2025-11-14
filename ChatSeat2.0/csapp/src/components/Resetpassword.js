import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "../supabaseClient";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";


const schema = Yup.object().shape({
    password: Yup.string()
        .matches(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/,
            "Password must:\n- Be 8+ characters\n- Include uppercase & lowercase\n- Include number & special char (e.g. * & @ ?)"
        )
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Please confirm your password"),
});


export default function ResetPassword() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successmessage, setsuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const passwordValue = watch("password") || "";

    const rules = {
        length: passwordValue.length >= 8,
        lowercase: /[a-z]/.test(passwordValue),
        uppercase: /[A-Z]/.test(passwordValue),
        number: /\d/.test(passwordValue),
        special: /[\W_]/.test(passwordValue),
    };


    // Effect to handle password reset link from URL hash
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken || !refreshToken) {
            setError("root", { message: "Invalid or expired password reset link." });
            return;
        }

        supabase.auth
            .setSession({ access_token: accessToken, refresh_token: refreshToken })
            .then(({ error }) => {
                if (error) setError("root", { message: `Session error: ${error.message}` });
            });
    }, [setError]);

    // Function to handle password reset
    const onSubmit = async ({ password }) => {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            setError("root", { message: `Reset failed: ${error.message}` });
            return;
        }
        setsuccessMessage("Password updated successfully!");
        setTimeout(() => navigate("/login"), 2000);
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <div className="flex-grow-1 d-flex align-items-center justify-content-center login-page">
                <div className="bg-white shadow p-4 p-md-5 rounded-3">
                    <h2 className="fw-bold text-center mb-4 intro-title">
                        Reset Password
                    </h2>
                    {errors.root?.message && (
                        <div className="alert alert-danger mb-3">{errors.root.message}</div>
                    )}
                    <form
                        onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="mb-3">
                            <label className="form-label">New password</label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control password-input ${errors.password ? "is-invalid" : ""}`}
                                    autoComplete="new-password"
                                    {...register("password")}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                                    onClick={() => setShowPassword((v) => !v)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {/* Password rules UI */}
                            <div className="mt-2 small">
                                <div className={rules.length ? "text-success" : "text-muted"}>
                                    {rules.length ? "✔" : "✖"} At least 8 characters
                                </div>
                                <div className={rules.lowercase ? "text-success" : "text-muted"}>
                                    {rules.lowercase ? "✔" : "✖"} Lowercase letter (a-z)
                                </div>
                                <div className={rules.uppercase ? "text-success" : "text-muted"}>
                                    {rules.uppercase ? "✔" : "✖"} Uppercase letter (A-Z)
                                </div>
                                <div className={rules.number ? "text-success" : "text-muted"}>
                                    {rules.number ? "✔" : "✖"} At least 1 number (0–9)
                                </div>
                                <div className={rules.special ? "text-success" : "text-muted"}>
                                    {rules.special ? "✔" : "✖"} 1 special character (!@#$%^&*)
                                </div>
                            </div>

                            {errors.password && (
                                <div className="invalid-feedback" style={{ whiteSpace: "pre-line" }}>
                                    {errors.password.message}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Confirm new password</label>
                            <div className="position-relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`form-control password-confirm-input ${errors.confirmPassword ? "is-invalid" : ""
                                        }`}
                                    autoComplete="new-password"
                                    {...register("confirmPassword")}
                                    placeholder="Re-enter new password"
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 small-toggle-btn"
                                    style={{ textDecoration: "none" }}
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <div className="invalid-feedback">
                                    {errors.confirmPassword.message}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isSubmitting || !isValid}
                        >
                            {isSubmitting ? "Updating…" : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}