import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function HomePMForm({ onClose, onSent, onError }) {
    const [form, setForm] = useState({ name: "", email: "", content: "" });
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        // Validation 
        if (!form.name.trim() || !form.content.trim()) return;
        setLoading(true);
        const { error } = await supabase.from("inbox_messages").insert([{
            name: form.name.trim(),
            email: form.email.trim(),  
            content: form.content.trim()
        }]);
        setLoading(false);

        if (error) {
            console.error("Message send error:", error);
            onError?.("Failed to send message. Please try again later.");
            return;
        }

        onSent?.();
        onClose?.();
    };

    return (
        <form onSubmit={submit} className="p-3 pm-form-container">
            <div className="mb-3">
                <label className="form-label">Your name </label>
                <input className="form-control" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Email (required)</label>
                <input type="email" className="form-control" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows={4} value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            <div className="d-flex gap-2">
                <button type="submit" className="form-send-btn" disabled={loading}>
                    {loading ? "Sending…" : "Send"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
}
