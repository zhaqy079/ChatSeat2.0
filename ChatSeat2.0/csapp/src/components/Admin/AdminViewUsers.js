import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


// Requests a list of all users from the database
export const fetchAllUsers = async () => {
    const { data, error } = await supabase.from("user_profiles")
        .select("*")
        .order('first_name', { ascending: true });

    if (error) {
        throw new Error("Failed to fetch users:" + error.message);
    }

    return data;
};

export default function AdminViewUsers() {
    const [userlist, setUserlist] = useState([]);

    // Stores the list of users from the database
    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchAllUsers();
                setUserlist(data);
            } catch (err) {
                console.error("Error fetching users:", err);
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
                    <h4 className="fw-bold mb-4 text-primary">View All Users</h4>

                    
                    { // User display logic, if no users display message otherwise display users and their details 
                        !userlist.length > 0 ? (
                        // If no users are found for the selected role, show a message
                        <h5 className="text-center">
                            No users found.
                        </h5>
                        ) : (
                        // Creation of table for display of users and their details
                        <table className="table w-100">
                            <thead className="">
                                <tr className="text-left">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Phone</th>
                                    <th className="p-3">Approved By</th>
                                    <th className="p-3">Inactive</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>{
                                userlist.map((user) => {
                                    // Finds the approved user from their id
                                    const approver = userlist.find(u => u.profile_id === user.approved_by);

                                    return (
                                        <tr key={user.profile_id} className="border-t">
                                            <td className="p-3">{user.first_name} {user.last_name}</td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">{user.phone}</td>
                                            <td className="p-3">{approver.first_name} {approver.last_name}</td>
                                            <td className="p-3">
                                                { // Changes incoming date format to '27 Nov 2025' format
                                                    user.inactive_at === null
                                                        ? "Active"
                                                        : new Date(user.inactive_at).toLocaleDateString("en-AU", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                            </td>
                                            <td>
                                                {/* Placeholder buttons, need to add redirection/confirmation/verification stuff */}
                                                <button type="button" className="btn btn-secondary me-2">Admin</button>
                                                <button type="button" className="btn btn-secondary me-2">Coordinator</button>
                                                <button type="button" className="btn btn-warning me-2">Deactivate</button>
                                                <button type="button" className="btn btn-danger">Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}