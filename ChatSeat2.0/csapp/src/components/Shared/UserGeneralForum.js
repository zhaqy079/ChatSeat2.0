import AdminNavbar from "../Admin/AdminNavbar";
import AdminSidebar from "../Admin/AdminSidebar";
import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


// Requests a list of all general forum posts from the database
export const fetchAllGeneralForumPosts = async () => {
    const { data, error } = await supabase.from("general_forum")
        .select(`*, user_profiles(*)`)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error("Failed to fetch general forum:" + error.message);
    }

    return data;
};

export default function UserGeneralForum() {
    const [generalforumlist, setGeneralforumlist] = useState([]);

    // Stores the list of general forum posts from the database
    useEffect(() => {
        const getGeneralForumPosts = async () => {
            try {
                const data = await fetchAllGeneralForumPosts();
                setGeneralforumlist(data);
            } catch (err) {
                console.error("Error fetching general forum posts:", err);
            }
        };

        getGeneralForumPosts(); 
    }, []);


    return (
        <div>
            <AdminNavbar title="General Forum" />
            <div className="d-flex">

                <AdminSidebar userName="userName" />
                <div className="p-4 flex-grow-1">
                    <h4 className="fw-bold mb-4 text-primary">General Forum</h4>

                    { // Forum display logic, if no forum posts display special message otherwise display all posts
                        !generalforumlist.length > 0 ? (
                        // If no posts are found, show a message
                        <h5 className="p-4 text-center">
                            No posts found.
                        </h5>
                    ) : (
                        generalforumlist.map((post) => (
                            <div key={post.user_id} className="card">
                                <div className="card-body">
                                    {/* Main content of a feedback post */}
                                    <h5 className="card-title">{post.user_profiles.first_name} {post.user_profiles.last_name}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">{post.user_profiles.email}</h6>
                                    <p className="card-text">{post.content}</p>
                                </div>
                                <div class="card-footer">
                                    <small className="text-muted text-center">Created:
                                        { // Logic to adjust displayed date to '27 Nov 2025' format
                                            new Date(post.created_at).toLocaleDateString("en-AU", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                    </small>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}