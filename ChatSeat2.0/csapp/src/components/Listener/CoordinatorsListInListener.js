import React, { useEffect, useState } from "react";
import ListenerSideBar from "./ListenerSideBar";
import { useSelector } from "react-redux";
import { createClient } from '@supabase/supabase-js';

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
            const { data, error } = await supabase.from("coordinators").select("*");
            if (!error && data.length > 0) {
                setCoordinators(data);
            } else {
                // Temporary hardcoded fallback
                setCoordinators([
                    {
                        id: 1,
                        name: "Noel Fraser",
                        place: "Campbelltown Library",
                        email: "noel.g.fraser@gmail.com",
                        phone: "0444 444 444"
                    },
                    {
                        id: 2,
                        name: "Tricia Vilkinnas",
                        place: "Campbelltown Library",
                        email: "Triciav0849@gmail.com",
                        phone: "0411 111 111"
                    },
                    {
                        id: 3,
                        name: "Coordinator C",
                        place: "Campbelltown Library",
                        email: "CoordinatorC@gmail.com",
                        phone: "0422 222 222"
                    }


                ]);
            }
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
                        <div className="col-12 col-md-6" key={coordinator.id}>
                            <div className="coordinator-card">
                                <h5>{coordinator.name}</h5>
                                <p>📍 {coordinator.place}</p>
                                <p>✉️ {coordinator.email}</p>
                                <p>📞 {coordinator.phone}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
        </div>
    );
}