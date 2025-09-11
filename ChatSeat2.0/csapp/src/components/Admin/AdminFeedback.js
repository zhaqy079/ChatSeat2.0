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
        .select(`*, user_profiles(*)`);

    if (error) {
        throw new Error("Failed to fetch feedback forum:" + error.message);
    }

    console.log(data);
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
                    <h4 className="fw-bold mb-4 text-primary">Feedback</h4>

                    { // Post display logic, if no posts display special message otherwise display all posts
                        !feedbacklist.length > 0 ? (
                            // If no posts are found, show a message
                        <h5 className="p-4 text-center">
                            No posts found.
                        </h5>
                    ) : (
                        <div className="card-group gap-4">
                            {feedbacklist.map((post) => (
                                <div className="col-lg">
                                    <div key={post.user_id} className="card" style={{ width: 16 + 'em' }}>
                                        <div className="card-body">
                                            {/* Main content of a feedback post */}
                                            <h5 className="card-title text-center">{post.user_profiles.first_name} {post.user_profiles.last_name}</h5>
                                            <h6 class="card-subtitle mb-2 text-muted text-center">{post.user_profiles.email}</h6>
                                            <p className="card-text">{post.content}</p>
                                        </div>
                                        <div class="card-footer">
                                            <div className="row">
                                                <small className="text-muted text-center">Created:
                                                    { // Logic to adjust displayed date to '27 Nov 2025' format
                                                        new Date(post.created_at).toLocaleDateString("en-AU", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })} </small>
                                            </div>

                                            <div className="row">
                                                { // Logic to check whether a post has been resolved, if it has display resolve time otherwise display resolve button
                                                    post.resolved_at === null
                                                        ? // Placeholder resolve button, back end logic still needs to be added 
                                                        <button type="button" className="btn btn-secondary">Resolve</button>
                                                        : <small className="text-muted text-center">Resolved: {new Date(post.created_at).toLocaleDateString("en-AU", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })} </small>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}