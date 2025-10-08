import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


// Requests a list of all users from the database
export const fetchAllUsers = async (userID) => {
    const { data, error } = await supabase.from("user_profiles")
        .select("*, coordinator_profiles(*, venue_locations(*)), admin_profiles(*)")
        .eq('profile_id', userID);;

    if (error) {
        throw new Error("Failed to fetch user:" + error.message);
    }

    return data;
};

const schema = Yup.object().shape({
    firstName: Yup.string()
        .matches(/^[A-Za-z]+$/, "Only letters allowed")
        .required("First name is required"),
    lastName: Yup.string()
        .matches(/^[A-Za-z]+$/, "Only letters allowed")
        .required("Last name is required"),
    phoneNumber: Yup.string()
        .matches(/^\d{10}$/, "Enter a valid 10-digit phone number")
        .required("Phone number is required")
});

// Supabase update feature
const updateUser = async ({
    firstName,
    lastName,
    phoneNumber,
}) => {

    const user = data.user;

    // If user is not created, throw an error
    const { error: profileError } = await supabase.from("user_profiles").update(
        {
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
        },
    ).eq('email', email);

    if (profileError) {
        throw new Error("Failed to add user data: " + profileError.message);
    }

    return user;
};

export default function AdminManageUser() {
    const [user, setUser] = useState([]);

    // Initialise the form with validation schema
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    // Function to handle form submission and it will be called when the form is submitted
    const onSubmit = async (data) => {
        try {
            await updateUser(data);
            toast.success("Update successful!");
        } catch (err) {
            console.error("Update error: ", err.message);
            toast.error("Update failed: " + err.message);
        }
    };

    // Stores the list of users from the database
    useEffect(() => {
        const getUsers = async (id = useParams()) => {
            try {
                const data = await fetchAllUsers(id);
                setUser(data);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        getUsers(); 
    }, []);

    
    return (
        <div>
            <AdminNavbar title="Display Users" />
            <div className="d-flex">
                <AdminSidebar userName="userName" />
                <div className="p-4 flex-grow-1">
                    <h4 className="fw-bold mb-4 text-primary">Manage User: { user.email }</h4>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={ user.first_name }
                                {...register("firstName")}
                            />
                            <p className="text-danger small">{errors.firstName?.message}</p>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user.last_name}
                                {...register("lastName")}
                            />
                            <p className="text-danger small">{errors.lastName?.message}</p>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                value={user.phone}
                                {...register("phoneNumber")}
                            />
                            <p className="text-danger small">{errors.phoneNumber?.message}</p>
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 fw-bold text-white mb-3 login-btn"
                        >
                            Update
                        </button>
                    </form>
                    
                    
                </div>
            </div>
        </div>
    );
}