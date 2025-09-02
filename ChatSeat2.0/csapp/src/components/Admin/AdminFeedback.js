import AdminNavbar from "../Admin/AdminNavbar";
import AdminSidebar from "../Admin/AdminSidebar";
import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


// Requests a list of all feedback posts from the database
export const fetchAllFeedbackPosts = async () => {
    const { data, error } = await supabase.from("feedback_forum")
        .select(`*`);

    if (error) {
        throw new Error("Failed to fetch feedback forum:" + error.message);
    }

    return data;
};

export default function AdminFeedback() {
    const [feedbacklist, setFeedbacklist] = useState([]);

    // Stores the list of feedback posts from the database
    useEffect(() => {
        const getFeedbackPosts = async () => {
            try {
                const data = await fetchAllFeedbackPosts();
                setFeedbacklist(data);
            } catch (err) {
                console.error("Error fetching feedback posts:", err);
            }
        };

        getFeedbackPosts(); 
    }, []);


    return (
        <div>
            <AdminNavbar title="Feedback" />
            <div className="d-flex">

                <AdminSidebar userName="userName" />
                <div className="p-4 flex-grow-1">
                    <h4 className="fw-bold mb-4 text-primary">General Forum</h4>

                    {feedbacklist.length > 0 ? (
                        feedbacklist.map((post) => (
                            <div key={post.user_id} className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{post.user_id} </h5>
                                    <p className="card-text">{post.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        // If no posts are found, show a message
                        <div colSpan="6" className="p-4 text-center text-gray-500">
                            No posts found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}