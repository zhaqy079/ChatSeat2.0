import { useSelector, useDispatch } from "react-redux";
import ListenerSideBar from "./ListenerSideBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import ListenerLinks from "./ListenerLinks";
import { logoutUser } from "../../state/loggedInUser";


export default function ListenerDashboard() {
    const user = useSelector((s) => s.loggedInUser?.success);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [resources, setResources] = useState([]);

    // For offcanvas 
    const getActiveLink = (url) =>
        location.pathname === url
            ? "dashboard-sidebar__link active"
            : "dashboard-sidebar__link";

    const handleLogout = async () => {
        await supabase.auth.signOut();
        dispatch(logoutUser());
        navigate("/");
    };

    const closeOffcanvas = () => {
        const el = document.getElementById("listenerMobileMenu");
        if (!el) return;
        const inst = window.bootstrap?.Offcanvas.getInstance(el);
        if (inst) inst.hide();
    };

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

        <div className="container-fluid px-0">
            <div className="d-md-none p-2">
                <button
                    className="btn btn-outline-primary btn-lg"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#listenerMobileMenu"
                    aria-controls="listenerMobileMenu"
                >
                    Menu
                </button>
            </div>

            <div className="d-flex">
                {/* Sidebar */}
                <aside className="px-0 flex-shrink-0">
                    <ListenerSideBar />
                </aside>

                {/* Main Content */}
                <main className="flex-grow-1 px-3 px-lg-4 py-4 d-flex justify-content-center">

                    <div className="dashboard-content-wrap w-100">
                        <div className="dashboard-card p-4">
                            <div className="card-body">

                                <h2 className="fw-bold intro-title mb-4 text-center">
                                    {/*Update conditional statement, */}
                                    Welcome Listener, {user?.firstName ? user.firstName : ""}!
                                </h2>
                                <p className="text-secondary mb-4 text-center">
                                    Thank you for agreeing to volunteer some of your time as a Listener on our Chat Seats.
                                    On this page you will find useful guides and resources to help you in your role.
                                </p>


                                <h2 className="intro-title text-center text-bold"> Guide for Chat Seat
                                </h2>


                                {/* Guides Section */}
                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-md-6">
                                        <div className="card border-primary bg-primary-subtle p-3 h-100">
                                            <h5 className="intro-title mb-3">Learn More About Listening</h5>
                                            <ul className="list-clean mt-2 mb-0">
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
                                            <h5 className="intro-title text-success mb-3">Tools and Support</h5>
                                            <p>Use the <strong>Booking tab</strong> to choose your Chat Seat venue and time.</p>
                                            <p>Use the <strong>Chat room</strong> to exchange ideas with other Listeners.</p>
                                            <p>Provide your <strong>Feedback</strong> through the <strong>Feedback tab</strong>.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card border-secondary bg-secondary-subtle p-3 h-100">
                                    <h5 className="intro-title text-dark">External Resources</h5>
                                    <ul className="list-clean mt-2 mb-0">
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
                        </div>
                    </div>

                </main>
            </div>
            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="listenerMobileMenu"
                aria-labelledby="listenerMobileMenuLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="listenerMobileMenuLabel" className="mb-0">Menu</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">

                    <ListenerLinks
                        getActiveLink={getActiveLink}
                        handleLogout={handleLogout}
                        onItemClick={closeOffcanvas}
                    />
                </div>
            </div>
        </div>

    );
}
