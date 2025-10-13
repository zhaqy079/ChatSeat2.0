import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


// Requests a user from the database
export const fetchUser = async (userID) => {
    const { data, error } = await supabase.from("user_profiles")
        .select("*, coordinator_profiles(*), admin_profiles(*)")
        .eq('profile_id', userID)
        .limit(1)
        .single();

    if (error) {
        throw new Error("Failed to fetch user:" + error.message);
    }

    return data;
};

export const fetchLocations = async () => {
    const { data, error } = await supabase.from("venue_locations")
        .select("*")
        .order('location_name', { ascending: true });

    if (error) {
        throw new Error("Failed to fetch locations:" + error.message);
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
    email,
    firstName,
    lastName,
    phoneNumber,
}) => {

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
};

export default function AdminManageUser() {
    const [user, setUser] = useState([]);
    const [locationlist, setLocationlist] = useState([]);
    const { id } = useParams();

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
        const getLocations = async () => {
            try {
                const data = await fetchLocations();
                setLocationlist(data);
            } catch (err) {
                console.error("Error fetching locations:", err);
            }
        };

        getLocations();
    }, []);

    // Stores the list of users from the database
    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await fetchUser(id);
                setUser(data);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        getUser(); 
    }, []);

    return (
        <div>
            <AdminNavbar title="Display Users" />
            <div className="d-flex">
                <AdminSidebar userName="userName" />
                <div className="p-4 flex-grow-1">
                    <h4>Manage User</h4>
                    {!user.profile_id ? <h3 className="text-center">Loading User Data.....</h3>
                        : <form>
                            <hr />
                            <h5>User Details: </h5>
                            <div>Name: {user.first_name} {user.last_name}</div>
                            <div>Email: {user.email}</div>
                            <hr />
                            <h5>Coordinator Locations</h5>
                            <table className="table">
                                <thead className="text-left">
                                    <tr className="text-left">
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Address</th>
                                        <th className="p-3">Location Inactive</th>
                                        <th className="text-center p-3">Coordinator at Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {locationlist.map((location) => {
                                        return (
                                            <tr key={location.location_id} className="border-t">
                                                <td className="p-3">{location.location_name}</td>
                                                <td className="p-3">{location.location_address}</td>
                                                <td className="p-3">
                                                    { // Changes incoming date format to '27 Nov 2025' format
                                                        location.inactive_at === null
                                                            ? "Active"
                                                            : new Date(location.inactive_at).toLocaleDateString("en-AU", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                </td>
                                                <td className="text-center">
                                                    <div className="justify-content-center">
                                                        <input type="checkbox" className="" defaultChecked={(user.coordinator_profiles.some(coord_location => coord_location.location_id === location.location_id))} />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <hr />
                            <h5>Admin Privileges</h5>
                            <label>
                                Admin: <input type="checkbox" name="admin" defaultChecked={!(user.admin_profiles === null)} />
                            </label>
                            <hr/>
                            <div className="d-flex align-items-center">
                                <div className="ms-auto">
                                    <button type="button" className="btn btn-info me-2 col">Update Privileges</button>
                                    <button type="button" className="btn btn-danger fw-bold col">DELETE USER</button>
                                </div>
                            </div>
                        </form>
                    }                    
                </div>
            </div>
        </div>
    );
}