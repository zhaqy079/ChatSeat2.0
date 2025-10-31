import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


export default function SubmitFeedback() {
    const [content, setContent] = useState("");
    const user = useSelector((state) => state.loggedInUser?.success);

    const createFeedback = async (e) => {
        e.preventDefault();

        if (!content) {
            alert("Please input something into the reply field.");
            return;
        }

        const { error } = await supabase
            .from('feedback_forum')
            .insert({
                user_id: user.id,
                content: content
            });

        if (error) {
            console.error("Feedback insert error:", error);
            toast.error("Oops! Something went wrong. Please try again later.");
        } else {
            toast.success("Thank you for your feedback!");
            setContent("");
        }

    };


    return (
            <div className="d-flex flex-grow-1 dashboard-page-content">
                <div className="flex-grow-1 px-3 px-md-4 py-4">
                <h4 className="fw-bold mb-4 text-primary">Feedback & Ideas</h4>
                    <form className="mb-4 flex-grow" onSubmit={createFeedback}>
                    <textarea id="newDiscussion" name="newFeedback" className="form-control border-4 mb-2" rows="5" placeholder="Create new feedback..." value={content} onChange={(e) => setContent(e.target.value)} />
                        <button type="submit" className="w-full btn btn-info">Post New Feedback</button>
                    </form>
                </div>
            </div>
    );
}