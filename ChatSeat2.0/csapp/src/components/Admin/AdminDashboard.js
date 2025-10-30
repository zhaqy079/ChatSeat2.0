import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import alarmIcon from "../../assets/icons/icons8-alarm-48.png";
import { supabase } from "../../supabaseClient";

export default function AdminDashboard() {
    const [pendingCount, setPendingCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPending = async () => {
            const { data, error } = await supabase
                .from("user_profiles")
                .select("profile_id")
                .is("approved_by", null);
            if (!error && data) setPendingCount(data.length);
        };
        fetchPending();
    }, []);

    const goToUserList = () => {
        sessionStorage.setItem("role", "pending"); 
        navigate("/AdminViewUsers");
    };

    return (
        <div>
            <div className="d-flex">
                <AdminSidebar userName="userName" />
                <main className="flex-grow-1 p-4">
                    <h2 className="fw-bold intro-title mb-2">Welcome</h2>

                    {pendingCount > 0 && (
                        <div className="pending-alert">
                            <p className="pending-text">
                                You have {pendingCount} new user
                                {pendingCount > 1 ? "s" : ""} waiting for approval.
                            </p>
                            <button onClick={goToUserList} className="pending-link">
                              
                                Review now
                                <img src={alarmIcon} alt="" className="icon" style={{ width: 24, height: 24 }} aria-hidden="true" />
                            </button>
                        </div>
                    )}

                    <div className="message-alert">
                        <p className="message-text">Use the dropdown in the top right to switch dashboards.</p>
                    </div>
                    
                </main>
            </div>
        </div>


    );
}