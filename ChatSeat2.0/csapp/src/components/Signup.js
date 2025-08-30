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
            "Password must be 8+ chars, include uppercase, lowercase, number, special char"
        )
        .required("Password is required"),
});

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
            await signupUser(data);
            toast.success("Signup successful!");
            navigate("/Login");
        } catch (err) {
            console.error("Signup error:", err.message);
            toast.error("Signup failed:" + err.message);
        }
    };
};