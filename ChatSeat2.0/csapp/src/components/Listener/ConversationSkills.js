import ListenerSidebar from "./ListenerSideBar";
import { Link } from "react-router-dom";
export default function ConversationSkills() {

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="col-12 col-md-3 col-lg-3 p-0">
                <ListenerSidebar />
            </div>

            {/* Main Content */}
            <main className="p-4">
                <h2 className="fw-bold text-primary mb-3 text-center">
                    Chat Seats - Conversation Guide
                </h2>
                <p className="text-center text-secondary mb-5">
                    Connecting Through Conversation
                </p>

                {/* First three cards in a row */}
                <div className="row g-3 justify-content-center">
                    <div className="col-12 col-md-4">
                        <div className="card border-primary bg-primary-subtle p-3 h-100">
                            <h5 className="card-title text-primary">Start the Conversation</h5>
                            <ul className="ms-3">
                                <li>Greet the participant warmly and introduce yourself.</li>
                                <li>Ask them their name.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card border-success bg-success-subtle p-3 h-100">
                            <h5 className="card-title text-success">During the Chat</h5>
                            <p className="mb-1">Ask open-ended questions like:</p>
                            <ul className="ms-3">
                                <li>How long have you lived around here?</li>
                                <li>Do you enjoy living here? Why or why not?</li>
                                <li>Do you have family and friends living around here?</li>
                                <li>What have you been doing today? What's on for the rest of the day?</li>
                                <li>What's been on your mind lately?</li>
                            </ul>
                            <p className="mt-3 mb-1">Use reflective listening to show understanding:</p>
                            <ul className="ms-3">
                                <li>"So, you are saying that...?"</li>
                                <li>"It sounds like you really enjoyed/or didn't enjoy that?"</li>
                                <li>"It sounds like you're feeling..."</li>
                            </ul>
                            <p className="mt-2">Summarize periodically to ensure clarity and understanding.</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card border-info bg-info-subtle p-3 h-100">
                            <h5 className="card-title text-info">Ending the Chat</h5>
                            <ul className="ms-3">
                                <li>Thank them for taking the time to chat.</li>
                                <li>Say how much you enjoyed chatting and that it's always great to meet people from the local community.</li>
                                <li>Let them know the Chat Seat will be here at different times and they're always welcome to sit and chat.</li>
                                <li>If you know when you'll be back, invite them to join again.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Extra Resource below */}
                <div className="row mt-3 justify-content-center">
                    <div className="col-12 col-md-6">
                        <div className="card border-secondary bg-secondary-subtle p-3 h-100">
                            <h5 className="card-title text-secondary">Extra Resource</h5>
                            <p>
                                Tip sheet from Ending Loneliness Together:{" "}
                                <Link
                                    to="https://endingloneliness.com.au/wp-content/uploads/2024/11/Conversation-Starters.pdf"
                                    target="_blank"
                                >
                                    <strong>View PDF</strong>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer text */}
                <div className="mt-5 text-center text-secondary px-3">
                    <p>Thank you for supporting your local community through conversation.</p>
                    <p>We hope you'll continue to join future "Chat Seat" opportunities!</p>
                </div>
            </main>
        </div>
    );
}