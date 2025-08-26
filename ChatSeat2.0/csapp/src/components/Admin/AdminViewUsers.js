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
    const { data, error } = await supabase.from("user_profiles").select("*");

    if (error) {
        throw new Error("Failed to fetch users:" + error.message);
    }

    console.log("fetchAllUsers data: ", data)
    return data;
};

export default function AdminSchedulingSetting() {
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

    console.log("getUsers data: ", userlist)

    return (
        <div>
            <AdminNavbar title="Display Users" />
            <div className="d-flex">

                <AdminSidebar userName="userName" />
                <div className="p-4 flex-grow-1">
                    <h4 className="fw-bold mb-4 text-primary">View All Users</h4>

                    <div className="overflow-x-auto">
                        <table className="min-w-[600px] w-full border rounded shadow bg-white">
                            <thead className="bg-[#e6f0ff]">
                                <tr className="text-left">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userlist.length > 0 ? (
                                    userlist.map((user) => (
                                        <tr key={user.id} className="border-t">
                                            <td className="p-3">
                                                {user.first_name} {user.last_name}
                                            </td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">{user.phone_number}</td>
                                        </tr>
                                    ))
                                ) : (
                                    // If no users are found for the selected role, show a message
                                    <tr>
                                        <td colSpan="6" className="p-4 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}