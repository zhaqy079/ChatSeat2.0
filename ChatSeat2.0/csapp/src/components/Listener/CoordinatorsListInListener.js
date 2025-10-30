import React, { useEffect, useState } from "react";
import ListenerSideBar from "./ListenerSideBar";
import { useSelector } from "react-redux";
import { createClient } from '@supabase/supabase-js';
import mapIcon from "../../assets/icons/icons8-map-48.png";
import phoneIcon from "../../assets/icons/icons8-phone-48.png";
import messageIcon from "../../assets/icons/icons8-email-48.png";

// Implement supabase logic later
const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function CoordinatorsListInListener() {
    const [coordinators, setCoordinators] = useState([]);
    const user = useSelector((state) => state.loggedInUser.success);

    // Fetch coordinators from Supabase
    useEffect(() => {
        const fetchCoordinators = async () => {
            const { data, error } = await supabase.from("coordinator_profiles").select("*, user_profiles(*), venue_locations(*)");

            setCoordinators(data);
        };

        fetchCoordinators();
    }, []);
    return (

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
    );
}