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

export default function AdminManageUser() {
    const [user, setUser] = useState([]);

    // Stores the list of users from the database
    useEffect(() => {
        const getUsers = async (profile_id) => {
            try {
                const data = await fetchAllUsers(profile_id);
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
                    <h4 className="fw-bold mb-4 text-primary">Manage User</h4>

                    
                    
                    
                </div>
            </div>
        </div>
    );
}