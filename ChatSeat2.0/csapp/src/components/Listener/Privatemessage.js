﻿import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import ListenerSideBar from "./ListenerSideBar";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function PrivateMessage() {
    const [messages, setMessages] = useState([]);
    const [replyFor, setReplyFor] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [loadingInbox, setLoadingInbox] = useState(false);

    // Refenrence: https://www.youtube.com/watch?v=btZII7TXlhk

    async function load() {
        setLoadingInbox(true);
        const { data, error } = await supabase
            .from("inbox_messages")
            .select("*")
            .eq("marked", false)   
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Load inbox error:", error);
        } else {
            setMessages(data ?? []);
        }
        setLoadingInbox(false);
    }

    useEffect(() => { load(); }, []);


    async function markAsRead(id) {
        setMessages((cur) => cur.filter((m) => m.message_id !== id));
        const { error } = await supabase
            .from("inbox_messages")
            .update({ marked: true })
            .eq("message_id", id);
        if (error) load(); 
    }

    async function sendReply({ to, subject, text, id }) {
        if (!to || !/^[^@]+@[^@]+\.[^@]+$/.test(to)) {
            alert("This message has no valid email address to reply to.");
            return;
        }
        if (!text?.trim()) {
            alert("Please enter a message.");
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke("send-reply", {
                body: { to, subject, text },
            });

            //console.log("send-reply >", { data, error });
            if (error) {
                alert(`Failed to send reply: ${error.message || "Unknown error"}`);
                return;
            }
            if (data?.error) {
                alert(`Failed to send reply: ${data.error}`);
                return;
            }

            // Success: mark it read and close the form
            await markAsRead(id);
            setReplyFor(null);
        } catch (e) {
            console.error(e);
            alert("Failed to send reply.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="d-flex  dashboard-page-content">
            <ListenerSideBar />
            <main className="flex-grow-1 p-4">
                <h2 className="fw-bold mb-3 intro-title">
                    Unread Messages
                </h2>
                {messages.length === 0 && (
                    <div className="alert alert-info">No new messages</div>
                )}
                <div className="col-xl-8 ps-3">
                    {messages.map((m) => (
                        <div key={m.message_id} className="pm-card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <h6 className="mb-2">{m.name}</h6>
                                    <small className="text-muted">
                                        {new Date(m.created_at).toLocaleString()}
                                    </small>
                                </div>
                                <div className="text-muted small mb-2">{m.email || "No email provided"}</div>
                                <p className="mb-3">{m.content}</p>

                                {replyFor?.message_id === m.message_id ? (
                                    <ReplyForm
                                        to={m.email}
                                        onCancel={() => setReplyFor(null)}
                                        onSend={(payload) =>
                                            sendReply({ ...payload, id: m.message_id })
                                        }
                                        sending={loading}
                                    />
                                ) : (
                                        <div className="d-flex justify-content-end gap-2 mt-3">
                                        <button
                                            className="pm-btn pm-btn-reply"
                                            disabled={!m.email}
                                            onClick={() => setReplyFor(m)}
                                            title={m.email ? "Reply by email" : "No email to reply"}
                                        >
                                            Reply
                                        </button>
                                        <button
                                            className="pm-btn pm-btn-mark"
                                            onClick={() => markAsRead(m.message_id)}
                                        >
                                            Mark as Read
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

function ReplyForm({ to, onCancel, onSend, sending }) {
    const [subject, setSubject] = useState("Thanks for your message");
    const [text, setText] = useState("");

    return (
        <div className="border rounded p-3 bg-light">
            <div className="mb-2">
                <label className="reply-label mb-2">To</label>
                <input className="form-control" value={to || ""} readOnly />
            </div>
            <div className="mb-2">
                <label className="reply-label mb-2">Subject</label>
                <input className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="mb-3">
                <label className="reply-label mb-2">Message</label>
                <textarea className="form-control" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div className="d-flex gap-2">
                <button
                    className="form-send-btn"
                    disabled={sending || !to || !text.trim()}
                    onClick={() => onSend({ to, subject: subject.trim(), text: text.trim() })}
                >
                    {sending ? "Sending…" : "Send"}
                </button>
                <button className="form-cancel-btn" onClick={onCancel}>Cancel</button>             
            </div>
        </div>
    );
}