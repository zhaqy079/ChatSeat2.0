import { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { useSelector } from "react-redux";


// Requests a list of all general forum posts from the database
export const fetchAllGeneralForumPosts = async () => {
    const { data, error } = await supabase.from("general_forum")
        .select(`general_forum_id, content, title, reply_to, created_at, user_id, user_profiles(*)`)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error("Failed to fetch general forum:" + error.message);
    }

    return data;
};



export default function UserGeneralForum() {
    const user = useSelector((state) => state.loggedInUser?.success);
    const [activePostId, setActivePostId] = useState(null);
    const [posts, setPosts] = useState([]);

    const replyRef = useRef(null);
    const newTitleRef = useRef(null);
    const newContentRef = useRef(null);
    

    // Stores the list of general forum posts from the database
    useEffect(() => {
        const getGeneralForumPosts = async () => {
            try {
                const data = await fetchAllGeneralForumPosts();
                setPosts(data);
            } catch (err) {
                console.error("Error fetching general forum posts:", err);
            }
        };

        getGeneralForumPosts(); 
    }, []);

    
    const createPost = async ({ title, message, reply }) => {
        if (!message?.trim()) {
            alert("Please input something into the reply field.");
            return;
        }
        // Top Post Must have title, Reply no-necessary
        if (!reply && !title?.trim()) {
            alert("Please enter a title.");
            return;
        }

        const { data, error } = await supabase
            .from("general_forum")
            .insert({
                user_id: user?.id,
                title: reply ? null : title?.trim(),
                content: message.trim(),
                reply_to: reply ?? null,
            })
            .select(
                "general_forum_id, content, title, reply_to, created_at, user_id, user_profiles(*)"
            )
            .single();

        if (error) {
            alert("Failed to post: " + error.message);
            return;
        }

        setPosts((prev) => [data, ...prev]);
        if (reply) setActivePostId(null);
        if (!reply) {
            if (newTitleRef.current) newTitleRef.current.value = "";
            if (newContentRef.current) newContentRef.current.value = "";
        } else {
            if (replyRef.current) replyRef.current.value = "";
        }


    };
    // Only Admin can delete the post 
    const deletePost = async (post_id) => {
        if (user?.role !== "admin") return;
        // Deletes the messages replies
        const collectIds = (id, all) => {
            const children = all.filter((p) => p.reply_to === id).map((p) => p.general_forum_id);
            return children.reduce((acc, cid) => acc.concat(collectIds(cid, all)), [id]);
        };
        const idsToRemove = collectIds(post_id, posts);
        setPosts((prev) => prev.filter((p) => !idsToRemove.includes(p.general_forum_id)));

        // Deletes primary message
        try {
            await supabase.from("general_forum").delete().eq("reply_to", post_id);
            await supabase.from("general_forum").delete().eq("general_forum_id", post_id);
        } catch (e) {
            console.error(e);
            
           window.location.reload();
        }
    };


    // Links posts with their replies
    function Post({post, posts}) {
        // Find direct replies to this post
        const replies = posts.filter(p => p.reply_to === post.general_forum_id);
        const role = post.user_profiles?.role || "user";
        const isAdmin = role === "admin";

        return (
            <div className="card post-card mb-3">
                <div className="card-body py-2">
                    {/* Main content of a feedback post */}
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <div className="d-flex align-items-center gap-2">
                                <span
                                    className={`badge ${isAdmin ? "bg-danger" : role === "coordinator" ? "bg-success" : "bg-info"
                                        }`}
                                >
                                    {isAdmin ? "Admin" : role === "coordinator" ? "Coordinator" : "Listener"}
                                </span>
                                <h6 className="card-title mb-0">
                                    {post.user_profiles?.first_name} {post.user_profiles?.last_name}
                                </h6>
               
                            </div>
                            <div className="card-subtitle">{post.user_profiles?.email}</div>
                        </div>
                        <small className="text-muted">
                            {new Date(post.created_at).toLocaleDateString("en-AU", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </small>
                    </div>

                    {/*title*/}
                    {!post.reply_to && (
                        <h5 className="mt-3 mb-2">{post.title || "- No title -"}</h5>
                    )}
                    {/*content*/}
                    <div className="card-text">{post.content}</div>
                    <div className="d-flex justify-content-end mt-3">

                        <button
                            type="button"
                            className="pm-btn pm-btn-reply"
                            onClick={() =>
                                setActivePostId((prev) =>
                                    prev === post.general_forum_id ? null : post.general_forum_id
                                )
                            }
                        >
                            Reply
                        </button>

                        {user?.role === "admin" && (
                            <button
                                type="button"
                                className="pm-btn-delete me-2"
                                onClick={() => deletePost(post.general_forum_id)}
                            >
                                Delete
                            </button>
                        )}
                       
                    </div>

                    {/*Reply*/}
                    {activePostId === post.general_forum_id && (
                        <form className="mt-3" onSubmit={async (e) => {
                            e.preventDefault();

                            const message = replyRef.current?.value;
                            const reply = post.general_forum_id;
                            await createPost({ title: null, message, reply: post.general_forum_id });
                        }}>
                            <textarea
                                className="form-control border-2"
                                placeholder="Write your reply..."
                                ref={replyRef}
                            />
                            <button type="submit" className="btn btn-outline-warning mt-2">
                                Post Reply
                            </button>
                        </form>
                    )}
                </div>
                {/*All the reply*/}
                {replies.length > 0 && (
                    <div className="mt-2 ms-3">
                        {replies.map((r) => (
                            <Post key={r.general_forum_id} post={r} posts={posts} />
                        ))}
                    </div>
                )}

            </div>
            
        );
    }

    return (
        <div className="flex-grow-1 dashboard-page-content" >
            <div className="flex-grow-1 px-3 px-md-4 py-4 forum forum-general">
                <h2 className="fw-bold dashboard-title fs-3 mb-4">General Forum</h2>
            <div className="forum-hero p-3 p-md-4 mb-3">
                    <form className="mb-2" onSubmit={async (e) => {
                        e.preventDefault();
                        const title = newTitleRef.current?.value;
                        const message = newContentRef.current?.value;
                        const reply = null;
                        await createPost({ title, message, reply: null });
                }}>
                    <input
                        className="form-control textarea-soft mb-2"
                        placeholder="Title (required)"
                        ref={newTitleRef}
                    />

                    <textarea id="newDiscussion" className="form-control textarea-soft mb-2" rows="5" placeholder="Create new discussion..." ref={newContentRef}/>
                    <button type="submit" className="btn btn-outline-warning">Post New Discussion</button>
                </form>
            </div>

                  

            {/*// Forum display logic, if no forum posts display special message otherwise display all posts*/}
            {posts.filter((p) => p.reply_to === null).length === 0 ? (
                        // If no posts are found, show a message
                    <h5 className="p-4 text-center">No posts found.</h5>
                    ) : (
                    posts
                        .filter(post => post.reply_to === null)
                            .map(post => (
                                <div key={post.general_forum_id} className="thread-indent">
                                    <Post post={post} posts={posts} />
                                </div>
                        ))
                    )}
                </div>
        </div>

    );
}

//  .map(post => (<Post key={post.id} post={post} posts={generalforumlist} />)) orginal 