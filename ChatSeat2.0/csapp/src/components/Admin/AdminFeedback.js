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
        .select(`*, user_profiles(*)`)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error("Failed to fetch feedback forum:" + error.message);
    }

    return data;
};

// Function call to resolve a post
async function resolvePost(feedbackID) {
    const { error: profileError } = await supabase.from("feedback_forum").update(
        {
            resolved_at: new Date()
        }
    ).eq('feedback_forum_id', feedbackID);

    if (profileError) {
        throw new Error("Failed to resolve post: " + profileError.message);
    }

    window.location.reload();
}

// Function call to unresolve a post
async function unresolvePost(feedbackID) {
    const { error: profileError } = await supabase.from("feedback_forum").update(
        {
            resolved_at: null
        }
    ).eq('feedback_forum_id', feedbackID);

    if (profileError) {
        throw new Error("Failed to unresolve post: " + profileError.message);
    }

    window.location.reload();
}

export default function AdminFeedback() {
    const [feedbacklist, setFeedbacklist] = useState([]);
    const [searchdata, setSearchdata] = useState(() => {
        return sessionStorage.getItem('feedback') || 'unresolved';
    });

    useEffect(() => {
        sessionStorage.setItem('feedback', searchdata);
    }, [searchdata]);

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


    // Filters posts according to inputted criteria
    const filteredFeedbackposts = feedbacklist
        .filter((post) => (
            searchdata === "all" || searchdata === ""
                ? true
                : (searchdata === "unresolved" ? post.resolved_at === null : post.resolved_at !== null)
        ));


    return (

        <div className="d-flex  dashboard-page-content" key = "1">
            {/* Sidebar on the left */}
            <aside>
                <AdminSidebar />
            </aside>
            {/* Right content area */}
            <div className="d-flex flex-grow-1 dashboard-page-content overflow-auto" style={{ height: 200 + "px" }} >
                <div className="flex-grow-1 px-3 px-md-4 py-4" key = "2">

                        <h4 className="fw-bold mb-4 text-primary">Feedback</h4>

                        {/* Dropdown menu to refine posts displayed */}
                        <div className="mb-3">
                        <select
                            className="form-select fw-semibold mb-2 w-auto "
                            value={searchdata}
                            onChange={(e) => setSearchdata(e.target.value)}>
                              <option value="unresolved" >Unresolved</option>
                              <option value="resolved">Resolved</option>
                              <option value="all">All Posts</option>
                            </select>
                        </div>

                        { // Post display logic, if no posts display special message otherwise display all posts
                            !filteredFeedbackposts.length > 0 ? (
                                // If no posts are found, show a message
                            <h5 className="p-4 text-center">
                                No posts found.
                            </h5>
                        ) : (
                            <div className="card-group gap-4 overflow-auto">
                                {filteredFeedbackposts.map((post) => (
                                    <div key={post.feedback_forum_id} className="col-md-2">
                                        <div className="card">
                                            <div className="card-body">
                                                {/* Main content of a feedback post */}
                                                <h5 className="card-title text-center">{post.user_profiles.first_name} {post.user_profiles.last_name}</h5>
                                                <h6 className="card-subtitle mb-2 text-muted text-center">{post.user_profiles.email}</h6>
                                                <p className="card-text overflow-auto h-50">{post.content}</p>
                                            </div>
                                            <div className="card-footer">
                                                <div className="row">
                                                    <small className="text-muted text-center">Created: {
                                                    // Logic to adjust displayed date to '27 Nov 2025' format
                                                            new Date(post.created_at).toLocaleDateString("en-AU", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })} </small>
                                                </div>

                                                <div className="">
                                                    { // Logic to check whether a post has been resolved, if it has display resolve time otherwise display resolve button
                                                    post.resolved_at === null
                                                            ? // Placeholder resolve button, back end logic still needs to be added 
                                                            <div className="row">
                                                                <button type="button" className="btn btn-secondary" onClick={() => resolvePost(post.feedback_forum_id)}>Resolve</button>
                                                            </div>
                                                        : (
                                                        <div className="row">
                                                            <small className="text-muted text-center">Resolved: { 
                                                                // Logic to adjust displayed date to '27 Nov 2025' format
                                                                    new Date(post.resolved_at).toLocaleDateString("en-AU", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    })}
                                                            </small>
                                                            <button type="button" className="btn btn-dark" onClick={() => unresolvePost(post.feedback_forum_id)}>Unresolve</button>
                                                        </div>
                                                        )}
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