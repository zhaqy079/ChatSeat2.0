import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createClient } from '@supabase/supabase-js';
// Keep same validation with former team programming
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Please update for supabase logic 
const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Validation schema for the signup form
const schema = Yup.object().shape({
    firstName: Yup.string()
        .matches(/^[A-Za-z]+$/, "Only letters allowed")
        .required("First name is required"),
    lastName: Yup.string()
        .matches(/^[A-Za-z]+$/, "Only letters allowed")
        .required("Last name is required"),
    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
    phoneNumber: Yup.string()
        .matches(/^\d{10}$/, "Enter a valid 10-digit phone number")
        .required("Phone number is required"),
    password: Yup.string()
        .matches(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/,
            "Password must:\n- Be 8+ characters\n- Include uppercase & lowercase\n- Include number & special char (e.g. * & @ ?)"
        )
        .required("Password is required"),
});


// Supabase signup feature
const signupUser = async ({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
}) => {
    // Default user role
    const defaultRole = "listener";
    // Validate input
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: defaultRole } }
    });

    // If there's an error during signup, throw an error
    if (error) {
        throw new Error("Signup failed：" + error.message);
    }

    const user = data.user;

    // If user is not created, throw an error
    const { error: profileError } = await supabase.from("user_profiles").update(
        {
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            role: defaultRole,
        },
    ).eq('email', email);

    if (profileError) {
        throw new Error("Failed to add user data: " + profileError.message);
    }

    return user;
};


export default function Signup() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Initialise the form with validation schema
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    // Function to handle form submission and it will be called when the form is submitted
    const onSubmit = async (data) => {
        try {
            document.getElementById("signupSubmit").disabled = true;
            await signupUser(data);
            toast.success("Signup successful!");
            navigate("/Login");
        } catch (err) {
            console.error("Signup error: ", err.message);
            toast.error("Signup failed: " + err.message);
            document.getElementById("signupSubmit").disabled = false;
        }
    };

    return (
    // Signup Page Form Page, keep same design with Login page
        <div className="min-vh-100 d-flex flex-column">
            <div className="flex-grow-1 d-flex align-items-center justify-content-center login-page">
                <div className="bg-white shadow p-4 p-md-5 rounded-3">
                    <h2 className="fw-bold text-center mb-4 intro-title">
                        Create an Account 
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate> 
                        <div className="mb-3">
                            <label className="form-label fw-semibold">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("firstName")}
                            />
                            <p className="text-danger small">{errors.firstName?.message}</p>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("lastName")}
                            />
                            <p className="text-danger small">{errors.lastName?.message}</p>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                {...register("email")}
                            />
                            <p className="text-danger small">{errors.email?.message}</p>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                {...register("phoneNumber")}
                            />
                            <p className="text-danger small">{errors.phoneNumber?.message}</p>
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

                        <button
                            type="submit"
                            className="btn w-100 fw-bold text-white mb-3 login-btn"
                            id="signupSubmit"
                        >
                            Sign Up
                        </button>

                        <div className="d-flex flex-column gap-2 mt-3 ">
                            <button
                                type="button"
                                className="btn btn-link p-0 back-btn"
                                onClick={() => navigate("/")}
                            >
                                Back to Home
                            </button>
                            
                            
                            <button
                                type="button"
                                className="btn btn-link p-0"
                                onClick={() => navigate("/login")}
                            >
                                Already have an account?
                                 Log In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}