import { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { useSelector } from "react-redux";



// Requests a list of all coordinator forum posts from the database
export const fetchAllCoordForumPosts = async () => {
    const { data, error } = await supabase.from("coordinator_forum")
        .select(`*, user_profiles(*)`)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error("Failed to fetch coordinator forum:" + error.message);
    }

    return data;
};



export default function CoordinatorForum() {
    const user = useSelector((state) => state.loggedInUser?.success);
    const [coordforumlist, setCoordforumlist] = useState([]);
    const [activePostId, setActivePostId] = useState(null);
    const replyRef = useRef(null);
    const postRef = useRef(null);

    // Stores the list of coord forum posts from the database
    useEffect(() => {
        const getCoordForumPosts = async () => {
            try {
                const data = await fetchAllCoordForumPosts();
                setCoordforumlist(data);
            } catch (err) {
                console.error("Error fetching coordinator forum posts:", err);
            }
        };

        getCoordForumPosts();
    }, []);


    const createPost = async ({ message, reply }) => {
        if (!message) {
            alert("Please input something into the reply field.");
            return;
        }

        const { error } = await supabase
            .from('coordinator_forum')
            .insert({
                coordinator_id: user.id,
                content: message,
                reply_to: reply
            });
        
        window.location.reload();
    }

    const deletePost = async (post_id) => {
        // Deletes the messages replies
        const post_replies = coordforumlist.filter(p => p.reply_to === post_id);
        {
            post_replies.map(reply => (
                deletePost(reply.coord_forum_id)
            ))
        }

        // Deletes primary message
        const { error } = await supabase
            .from('coordinator_forum')
            .delete()
            .eq('coord_forum_id', post_id);

        window.location.reload();
    }


    // Links posts with their replies
    function Post({ post, posts }) {
        // Find direct replies to this post
        const replies = posts.filter(p => p.reply_to === post.coord_forum_id);

        return (
           
                <div className="card post-card mb-3">
                <div className="card-body py-2">
                    {/* Main content of a feedback post */}
                    <div>
                        <div className="d-flex justify-content-between align-items-start post-meta">
                        <div>
                                <h6 className="card-title mb-1 author">{post.user_profiles.first_name} {post.user_profiles.last_name}</h6>
                                <div className="card-subtitle email text-muted">{post.user_profiles.email}</div>
                            </div>
                            <small className="text-muted">
                                {new Date(post.created_at).toLocaleDateString("en-AU", {
                                    year: "numeric", month: "short", day: "numeric",
                                })}
                            </small>
                        </div>

                        {/*Post content*/}
                        <div className="card-text content-box mt-2">{post.content}</div>
                        {/*Button*/}
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button type="button" className="pm-btn-reply" onClick={() =>
                                    setActivePostId(prev => prev === post.coord_forum_id ? null : post.coord_forum_id)
                                }
                            >
                                Reply
                            </button>
                            {user.id === post.user_profiles.profile_id && (
                                <button type="button" className="pm-btn-delete me-2"
                                    onClick={() => deletePost(post.coord_forum_id)}
                                >
                                    Delete
                                </button>
                            )}
                    </div>
                  
                    {/*Reply*/}
                    {activePostId === post.coord_forum_id && (
                            <form className="mt-3"  onSubmit={async (e) => {
                            e.preventDefault();

                            const message = replyRef.current?.value;
                            const reply = post.coord_forum_id;
                                await createPost({ message, reply: post.coord_forum_id });
                        }}>
                            <textarea
                                    className="form-control border-2"
                                    name="replyPost"
                                placeholder="Write your reply..."
                                ref={replyRef}
                            />
                            <button type="submit" className="btn btn-primary mt-2">
                                Post Reply
                            </button>
                        </form>
                    )}
                    </div>
                </div>
                {replies.map(reply => (
                    <Post key={reply.coord_forum_id} className="thread-indent mt-2" post={reply} posts={posts} />
                ))}
            </div>
        );
    }

    return (
        <div className="flex-grow-1 dashboard-page-content">
            <div className="flex-grow-1 px-3 px-md-4 py-4 forum forum-coord">
               
                    <h2 className="fw-bold dashboard-title fs-3 mb-4">Coordinator Hub</h2>
               
                    <form className="mb-2" onSubmit={async (e) => {
                        e.preventDefault();

                        const message = postRef.current?.value;
                        const reply = null;
                        await createPost({ message, reply });
                    }}>
                    <textarea id="newDiscussion" name="newDiscussion" className="form-control textarea-soft mb-2" rows="5" placeholder="Create new discussion..." ref={postRef} />
                        <button type="submit" className="btn btn-outline-primary">Post New Discussion</button>
                    </form>

               
                <hr className="mt-3 mb-4" />

                    { // Forum display logic, if no forum posts display special message otherwise display all posts
                        !coordforumlist.length > 0 ? (
                            // If no posts are found, show a message
                            <h5 className="p-4 text-center">
                                No posts found.
                            </h5>
                        ) : (
                            coordforumlist
                                .filter(post => post.reply_to === null) 
                                .map(post => (
                                    <div key={post.coord_forum_id} className="thread-indent">
                                        <Post post={post} posts={coordforumlist} />
                                    </div>
                                ))
                        )}
                
            </div>
        </div>
      
            
    );
}