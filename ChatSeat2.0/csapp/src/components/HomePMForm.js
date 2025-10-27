import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Validation: Forbidden characters & message length
const FORBIDDEN_CHAR = /[<>&|`]/g;
const MESSAGE_LENGTH = 1000;

function clearUnsafeChars(str) {
    return str.replace(FORBIDDEN_CHAR, "");
}
function wordCount(str) {
    const words = str.trim().split(/\s+/).filter(Boolean);
    return words.length;
}

export default function HomePMForm({ onClose, onSent, onError }) {
    const [form, setForm] = useState({ name: "", email: "", content: "" });
    const [loading, setLoading] = useState(false);
    const [removeChars, setRemoveChars] = useState(false);

    // Clear unsafe chars and set words limitation
    const onNameChange = (e) => {
        const raw = e.target.value;
        const cleaned = clearUnsafeChars(raw);
        setRemoveChars(cleaned !== raw);
        setForm((f) => ({ ...f, name: cleaned }));

    };
    const onContentChange = (e) => {
        const raw = e.target.value;
        const cleaned = clearUnsafeChars(raw);
        setRemoveChars(cleaned !== raw);
        setForm((f) => ({ ...f, content: cleaned }));
    };

    const words = wordCount(form.content);
    const wordsLimit = words > MESSAGE_LENGTH;

    // PM message front-end maximium 3 times limitation
    const DAILY_LIMIT = 3;
    function dailySendMessage() {
        const key = "dailyPM";
        const today = new Date().toISOString().slice(0, 10);
        let s = {};
        try {
            s = JSON.parse(localStorage.getItem(key)) || {};
        } catch { }
        if (s.date !== today) s = { date: today, count: 0 };
        return {
            ok: s.count < DAILY_LIMIT,
            state: s,
            key
        };
    }
    function sendCount(state, key) {
        const today = new Date().toISOString().slice(0, 10);
        const next = { date: today, count: (state?.count || 0) + 1 };
        localStorage.setItem(key, JSON.stringify(next));
    }


    const submit = async (e) => {
        e.preventDefault();

        // Max Message limit
        if (wordsLimit) {
            onError?.("Your message exceeds the 1000 words limit. Please shorten it.");
            return;
        }
        // PM message daily limitation
        const gate = dailySendMessage();
        if (!gate.ok) {
            onError?.("You’ve reached today’s limit (3 messages) today.\n Please try again tomorrow.");
            return;
        }
        // PM message send validation 
        if (!form.name.trim() || !form.content.trim()) return;
        setLoading(true);
        const { error } = await supabase.from("inbox_messages").insert([{
            name: form.name.trim(),
            email: form.email.trim(),  
            content: form.content.trim()
        }]);
        setLoading(false);

        // Auto reply
        // after successful insert
        if (form.email?.trim()) {
            await supabase.functions.invoke("send-reply", {
                body: {
                    to: form.email.trim(),
                    subject: "Thanks for reaching out to ChatSeat",
                    text: `\n\nThanks for contacting ChatSeat. \nOur Listener will review your message and reply soon.`
                    
                }
            });
        }

        if (error) {
            console.error("Message send error:", error);
            onError?.("Failed to send message. Please try again later.");
            return;
        }

        sendCount(gate.state, gate.key);
        onSent?.();
        onClose?.();
    };

    return (
        <form onSubmit={submit} className="p-3 pm-form-container">
            <div className="mb-3">
                <label className="form-label p-1">Your name </label>
                <input className="form-control" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-3">
                <label className="form-label p-1">Email (required)</label>
                <input type="email" className="form-control" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="mb-3">
                <label className="form-label p-1">Message</label>
                <small className={`text-${wordsLimit ? "danger" : "muted"}`}>
                     {words}/{MESSAGE_LENGTH} words
                </small>
                <textarea className="form-control" rows={4} value={form.content}
                    onChange={onContentChange} required />
                {removeChars && (
                    <small className="text-muted d-block mt-1">
                        We removed a few unsupported symbols (like {'< > |'}).
                    </small>
                )}
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
