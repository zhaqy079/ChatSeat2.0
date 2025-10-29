import AdminSidebar from "../Admin/AdminSidebar";
import { useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function SubmitFeedback() {
    const [content, setContent] = useState("");

    const createFeedback = async (e) => {
        e.preventDefault();

        if (!content) {
            alert("Please input something into the reply field.");
            return;
        }

        const { error } = await supabase
            .from('feedback_forum')
            .insert({
                user_id: sessionStorage.getItem('user_id'),
                content: content
            });

        console.log(error)

        window.location.reload();
    }


    return (
        <div>
            <div className="d-flex">

                <AdminSidebar userName="userName" />
                <div className="p-4 flex-grow-1">
                    <h2 className="fw-bold dashboard-title fs-3 mb-4">Your feedback</h2>
                   
                    <form className="mb-2" onSubmit={createFeedback}>
                        <textarea id="newDiscussion" className="form-control border-4 mb-2" rows="5" placeholder="Create new feedback..." onChange={(e) => setContent(e.target.value)} />
                        <button type="submit" className="w-full btn btn-primary">Post New Feedback</button>
                    </form>
                </div>
            </div>
        </div>
    );
}