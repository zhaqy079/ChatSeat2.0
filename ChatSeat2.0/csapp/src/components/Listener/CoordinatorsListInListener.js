import React, { useEffect, useState } from "react";
import ListenerSideBar from "./ListenerSideBar";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../../supabaseClient";
import mapIcon from "../../assets/icons/icons8-map-48.png";
import phoneIcon from "../../assets/icons/icons8-phone-48.png";
import messageIcon from "../../assets/icons/icons8-email-48.png";

import { Link, useLocation, useNavigate } from "react-router-dom";
import ListenerLinks from "./ListenerLinks";
import { logoutUser } from "../../state/loggedInUser";


export default function CoordinatorsListInListener() {
    const [coordinators, setCoordinators] = useState([]);
    const user = useSelector((state) => state.loggedInUser.success);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

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

    // Fetch coordinators from Supabase
    useEffect(() => {
        const fetchCoordinators = async () => {
            const { data, error } = await supabase.from("coordinator_profiles").select("*, user_profiles(*), venue_locations(*)");

            setCoordinators(data);
        };

        fetchCoordinators();
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

            <div className="d-flex  dashboard-page-bg ">
                {/* Sidebar on the left */}
                <aside>
                    <ListenerSideBar />
                </aside>

                {/* Coordinator Cards */}
                <div className="flex-1 p-4">
                    <div className="row g-4">
                        {coordinators.length === 0 ? (
                            <p className="text-muted">No coordinators available.</p>
                        ) : (
                            coordinators.map((coordinator) => (
                                <div className="col-12 col-md-6" key={coordinator.coordinator_id}>
                                    <div className="coordinator-card">
                                        <h5>
                                            {coordinator.user_profiles.first_name} {coordinator.user_profiles.last_name}</h5>
                                        <p>  <img src={mapIcon} alt="Map" className="icon" style={{ width: 24, height: 24 }} aria-hidden="true" />
                                            {coordinator.venue_locations.location_name}</p>

                                        <p> <img src={messageIcon} alt="Map" className="icon" style={{ width: 24, height: 24 }} aria-hidden="true" />
                                            {coordinator.user_profiles.email}</p>

                                        <p> <img src={phoneIcon} alt="Map" className="icon" style={{ width: 24, height: 24 }} aria-hidden="true" />
                                            {coordinator?.user_profiles?.phone || " Not Available"}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="listenerMobileMenu"
                aria-labelledby="listenerMobileMenuLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="listenerMobileMenuLabel" className="mb-0">
                        Hello, {user?.firstName ?? ""}!
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
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