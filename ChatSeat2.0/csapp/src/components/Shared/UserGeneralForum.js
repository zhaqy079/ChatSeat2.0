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
    const [activePostId, setActivePostId] = useState(null);
    const [messagedata, setMessagedata] = useState({
        message: null,
        reply: null
    });
    const replyRef = useRef(null);
    const postRef = useRef(null);

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

    
    const createPost = async ({ message, reply }) => {
        if (!message) {
            alert("Please input something into the reply field.");
            return;
        }

        const { error } = await supabase
            .from('general_forum')
            .insert({ user_id: "73fd19d1-5665-479b-8500-5ea691b0e1be", content: message, reply_to: reply });

        window.location.reload();
    }


    // Links posts with their replies
    function Post({post, posts}) {
        // Find direct replies to this post
        const replies = posts.filter(p => p.reply_to === post.general_forum_id);

        return (
            <div key={post.general_forum_id} className="card mb-2" style={{ marginLeft: 10, marginRight: 1, padding: "1px 0" }}>
                <div className="card-body py-2">
                    {/* Main content of a feedback post */}
                    <div>
                        <div className="d-flex align-items-center">
                            <h6 className="card-title col">{post.user_profiles.first_name} {post.user_profiles.last_name}</h6>
                            <small className="text-muted col text-end">Created: {
                                // Logic to adjust displayed date to '27 Nov 2025' format
                                new Date(post.created_at).toLocaleDateString("en-AU", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </small>
                        </div>
                        <div className="d-flex align-items-center">
                            <h6 className="card-subtitle mb-2 text-muted">{post.user_profiles.email}</h6>
                            <button type="button" className="btn btn-secondary ms-auto" onClick={() => {
                                setActivePostId(prevId => (prevId === post.general_forum_id ? null : post.general_forum_id));
                            } }>Reply</button>
                        </div>
                    </div>
                    <p className="card-text">{post.content}</p>

                    {activePostId === post.general_forum_id && (
                        <form onSubmit={async (e) => {
                            e.preventDefault();

                            const message = replyRef.current?.value;
                            const reply = post.general_forum_id;
                            await createPost({ message, reply });
                        }}>
                            <textarea
                                className="form-control"
                                placeholder="Write your reply..."
                                ref={replyRef}
                            />
                            <button type="submit" className="btn btn-primary mt-2">
                                Post
                            </button>
                        </form>
                    )}
                </div>
                {replies.map(reply => (
                    <Post key={reply.id} post={reply} posts={posts}/>
                ))}
            </div>
        );
    }

    return (
        <div>
            <AdminNavbar title="General Forum" />
            <div className="d-flex">

                <AdminSidebar userName="userName" />
                <div className="p-4 flex-grow-1">
                    <h4 className="fw-bold mb-4 text-primary">General Forum</h4>
                    <form className="mb-2" onSubmit={async (e) => {
                        e.preventDefault();

                        const message = postRef.current?.value;
                        const reply = null;
                        await createPost({ message, reply });
                    }}>
                        <textarea id="newDiscussion" className="form-control p-2 mb-2" rows="5" placeholder="Create new discussion..." ref={postRef}/>
                        <button type="submit" className="w-full btn btn-primary">Post New Discussion</button>
                    </form>


                    { // Forum display logic, if no forum posts display special message otherwise display all posts
                        !generalforumlist.length > 0 ? (
                        // If no posts are found, show a message
                        <h5 className="p-4 text-center">
                            No posts found.
                        </h5>
                    ) : (
                    generalforumlist
                        .filter(post => post.reply_to === null) // Only top-level posts
                        .map(post => (
                            <Post key={post.id} post={post} posts={generalforumlist} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}