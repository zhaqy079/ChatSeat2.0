import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import ListenerSideBar from "./ListenerSideBar";
import { Link } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function ListenerDashboard() {
    const user = useSelector((s) => s.loggedInUser?.success);

    const [resources, setResources] = useState([]);

    // Fetch resources from Supabase
    useEffect(() => {
        const fetchResources = async () => {
            const { data, error } = await supabase
                .from("role_resources")
                .select("*")
                .eq("role", "listener")
                .order("created_at", { ascending: false });
            if (error) console.error(error);
            else setResources(data);
        };
        fetchResources();
    }, []);

    return (

        <div className="d-flex">
            {/* Sidebar */}
            <div className="col-12 col-md-3 col-lg-3 p-0">
                <ListenerSideBar />
            </div>

            {/* Main Content */}
            <main className="p-4">
                <div className="card shadow-sm rounded-3 p-4">

                    <h2 className="fw-bold text-primary mb-4 text-center">
                        Welcome Listener: {user?.firstName ? user.firstName : ""}
                    </h2>

                    <div className="text-center">
                        <p className="text-secondary mb-4">
                            Thank you for agreeing to volunteer some of your time as a Listener on our Chat Seats.
                            On this page you will find useful guides and resources to help you in your role.
                        </p>

                        <h2 className="fw-bold text-primary mb-4">
                            Guide for Chat Seat
                        </h2>
                    </div>


                    {/* Guides Section */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6">
                            <div className="card border-primary bg-primary-subtle p-3 h-100">
                                <h5 className="card-title text-primary">Learn More About Listening</h5>
                                <ul className="ms-3 mb-0">
                                    <li>
                                        <Link to="/listeningskills" className="text-decoration-none text-primary">
                                            Good Listening Skills
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/conversationskills" className="text-decoration-none text-primary">
                                            Good Conversation Skills
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/makepeoplecomfortable" className="text-decoration-none text-primary">
                                            Making People Comfortable on the Chat Seat
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="card border-success bg-success-subtle p-3 h-100">
                                <h5 className="card-title text-success mb-3">Tools and Support</h5>
                                <p>Use the <strong>Booking tab</strong> to choose your Chat Seat venue and time.</p>
                                <p>Use the <strong>Chat room</strong> to exchange ideas with other Listeners.</p>
                                <p>Provide your <strong>Feedback</strong> through the <strong>Feedback tab</strong>.</p>
                            </div>
                        </div>
                    </div>

                    <div className="card border-secondary bg-secondary-subtle p-3 h-100">
                        <h5 className="card-title">External Resources</h5>
                        <ul className="ms-3 mb-0">
                            {resources.map((r) => (
                                <li key={r.resource_id}>
                                    <Link to={r.link} className="text-decoration-none" target="_blank" rel="noreferrer">
                                        {r.content}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </main>
        </div>
    );
}
