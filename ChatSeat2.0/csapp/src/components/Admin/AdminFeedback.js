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
                <div className="p-4">
                    <h4 className="fw-bold mb-4 text-primary">Feedback</h4>

                    {feedbacklist.length > 0 ? (
                        <div className="card-group gap-4">
                            {feedbacklist.map((post) => (
                                <div className="col-lg">
                                    <div key={post.user_id} className="card" style={{width: 16 + 'em'}}>
                                        <div className="card-body">
                                            <h5 className="card-title text-center">{post.user_profiles.first_name} {post.user_profiles.last_name}</h5>
                                            <small class="text-muted text-center">{post.user_profiles.email}</small>
                                            <p className="card-text">{post.content}</p>
                                        </div>
                                        <div class="card-footer">
                                            <div className="row">
                                                <small className="text-muted text-center" >Created: {new Date(post.created_at).toLocaleDateString("en-AU", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })} </small>
                                            </div>

                                            <div className="row">
                                                {post.resolved_at === null
                                                    ? <button type="button" className="btn btn-secondary">Resolve</button>
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