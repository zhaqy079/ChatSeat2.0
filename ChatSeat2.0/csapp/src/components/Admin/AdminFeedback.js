import AdminSidebar from "../Admin/AdminSidebar";
import { useState, useEffect} from "react";
import { supabase } from "../../supabaseClient";
import AdminLinks from "./AdminLinks";
import { useDashboardNav } from "../Shared/useDashboardNav";

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

export default function AdminFeedback() {
    const { user, getActiveLink, handleLogout, closeOffcanvas } = useDashboardNav();
    const [feedbacklist, setFeedbacklist] = useState([]);
    const [searchdata, setSearchdata] = useState(() => {
        return sessionStorage.getItem('feedback') || 'unresolved';
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sessionStorage.setItem('feedback', searchdata);
    }, [searchdata]);

    // Stores the list of feedback posts from the database
    const refreshFeedback = async () => {
        try {
            setLoading(true);
            const data = await fetchAllFeedbackPosts();
            setFeedbacklist(data || []);
        } catch (err) {
            console.error("Error fetching feedback posts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshFeedback();
    }, []);



// Function call to a post
const handleResolve = async (feedbackID) => {
    try {
        const { error } = await supabase
            .from("feedback_forum")
            .update({ resolved_at: new Date().toISOString() })
            .eq("feedback_forum_id", feedbackID);

        if (error) throw error;

        setFeedbacklist((prev) =>
            prev.map((post) =>
                post.feedback_forum_id === feedbackID
                    ? { ...post, resolved_at: new Date().toISOString() }
                    : post
            )
        );
    } catch (err) {
        console.error("Failed to resolve post:", err.message);
        alert("Failed to mark as resolved. Please try again.");
    }
};

const handleUnresolve = async (feedbackID) => {
    try {
        const { error } = await supabase
            .from("feedback_forum")
            .update({ resolved_at: null })
            .eq("feedback_forum_id", feedbackID);

        if (error) throw error;

        setFeedbacklist((prev) =>
            prev.map((post) =>
                post.feedback_forum_id === feedbackID
                    ? { ...post, resolved_at: null }
                    : post
            )
        );
    } catch (err) {
        console.error("Failed to unresolve post:", err.message);
        alert("Failed to unresolve. Please try again.");
    }
};

// Admin able to delete the feedback
const handleDelete = async (feedbackID) => {
    const ok = window.confirm(
        "Are you sure want to delete this feedback? This cannot be undone."
    );
    if (!ok) return;

    try {
        const { error } = await supabase
            .from("feedback_forum")
            .delete()
            .eq("feedback_forum_id", feedbackID);

        if (error) throw error;
        setFeedbacklist((prev) =>
            prev.filter((p) => p.feedback_forum_id !== feedbackID)
        );
    } catch (err) {
        console.error("Failed to delete post:", err.message);
        alert("Delete failed. Please try again.");
    }
};

    // Filters posts according to inputted criteria
    const filteredFeedbackposts = feedbacklist
        .filter((post) => (
            searchdata === "all" || searchdata === ""
                ? true
                : (searchdata === "unresolved" ? post.resolved_at === null : post.resolved_at !== null)
        ));


    return (

        <div className="container-fluid px-0">
            <div className="d-lg-none p-2">
                <button
                    className="btn btn-outline-primary btn-lg"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileMenu"
                    aria-controls="mobileMenu"
                >
                    Menu
                </button>
            </div>

            <div className="d-flex">
                {/* Sidebar */}
                <aside className="px-0 flex-shrink-0">
                    <AdminSidebar />
                </aside>
                {/* Right content area */}
                <div className="d-flex flex-grow-1 dashboard-page-content overflow-auto">
                    <div className="flex-grow-1 px-3 px-md-4 py-4" key="2">

                        <h2 className="fw-bold dashboard-title fs-3 mb-4">Feedback</h2>

                        {/* Dropdown menu to refine posts displayed */}
                        <div className="mb-3">
                            <select
                                className="form-select fw-semibold mb-2 w-auto "
                                value={searchdata}
                                name="feedbackResolved"
                                onChange={(e) => setSearchdata(e.target.value)}>
                                <option value="unresolved" >Unresolved</option>
                                <option value="resolved">Resolved</option>
                                <option value="all">All Posts</option>
                            </select>
                        </div>

                        {loading ? (
                            <p className="p-4 text-center text-muted">Loading feedback…</p>
                        ) : !filteredFeedbackposts.length ? (
                            <h5 className="p-4 text-center">No feedback found.</h5>
                        ) : (
                            <div className="row row-cols-1 row-cols-md-3 g-4">
                                {filteredFeedbackposts.map((post) => (
                                    <div key={post.feedback_forum_id} className="col">
                                        <div className="card h-100 position-relative">
                                            {post.resolved_at && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-light position-absolute top-0 end-0 m-2"
                                                    title="Delete this feedback"
                                                    onClick={() => handleDelete(post.feedback_forum_id)}
                                                >
                                                    &times;
                                                </button>
                                            )}

                                                <div className="card-body">
                                                    {/* Main content of a feedback post */}
                                                    <h5 className="card-title text-center">{post.user_profiles.first_name} {post.user_profiles.last_name}</h5>
                                                    <h6 className="card-subtitle mb-2 text-muted text-center">{post.user_profiles.email}</h6>
                                                    <p className="card-text overflow-auto h-50">{post.content}</p>
                                                </div>
                                                <div className="card-footer text-center">

                                                    <small className="text-muted text-center">Created: {
                                                        // Logic to adjust displayed date to '27 Nov 2025' format
                                                        new Date(post.created_at).toLocaleDateString("en-AU", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })} </small>

                                                    {/*// Logic to check whether a post has been resolved, if it has display resolve time otherwise display resolve button*/}
                                                    {post.resolved_at === null
                                                        ? // Placeholder resolve button, back end logic still needs to be added 
                                                        <div className="row">
                                                        <button type="button" className="btn btn-success btn-sm px-3 py-1" onClick={() => handleResolve(post.feedback_forum_id)}>Resolve</button>
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
                                                            <button type="button" className="btn btn-outline-danger btn-sm px-3 py-1" onClick={() => handleUnresolve(post.feedback_forum_id)}>Unresolve</button>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                    ))}
                                </div>
                            )}
                    </div>
                </div>
            </div>
            <div
                className="offcanvas offcanvas-start"
                id="mobileMenu"
                tabIndex="-1"
                aria-labelledby="mobileMenuLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="mobileMenuLabel" className="mb-0">
                        Hello, {user?.firstName ?? ""}!
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">

                    <AdminLinks
                        getActiveLink={getActiveLink}
                        handleLogout={handleLogout}
                        onItemClick={closeOffcanvas}
                    />
                </div>
            </div>
        </div>
    );
}