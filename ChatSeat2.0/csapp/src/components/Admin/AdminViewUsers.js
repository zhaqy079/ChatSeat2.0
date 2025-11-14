import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import AdminLinks from "./AdminLinks";
import { useDashboardNav } from "../Shared/useDashboardNav";

// Requests a list of all users from the database
export const fetchAllUsers = async () => {
    const { data, error } = await supabase.from("user_profiles")
        .select("*, coordinator_profiles(*, venue_locations(*)), admin_profiles(*)")
        .neq('role', 'deleted')
        .order('first_name', { ascending: true });

    if (error) {
        throw new Error("Failed to fetch users:" + error.message);
    }

    return data;
};


function UserTable({ userlist, currentuser, onApprove, onDeactivate, onReactivate }) {
    return (
        <table className="table">
            <thead className="text-left">
                <tr className="text-left">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Approved By</th>
                    <th className="p-3">Inactive</th>
                    <th className="p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {userlist.map((user) => {
                    // Finds the approved user from their id
                    const user_approver = user.approved_by ? userlist.find(u => u.profile_id === user.approved_by) : null;
                    const isPending = !user.approved_by;

                    return (
                    <tr key={user.profile_id} className="border-t">
                        <td className="p-3">{user.first_name} {user.last_name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.phone}</td>
                            {!user_approver ? (
                                <td className="p-3">Not yet approved</td>
                            ) : (
                                <td className="p-3">
                                    {user_approver.first_name}{" "}
                                    {user_approver.last_name}
                                </td>
                            )}

                        <td className="p-3">
                            { // Changes incoming date format to '27 Nov 2025' format
                                user.inactive_at === null
                                    ? "Active"
                                    : new Date(user.inactive_at).toLocaleDateString("en-AU", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                        </td>
                        <td>
                            {/* Displays a variety of different buttons depending on whether the user is an admin or currently active/inactive */}
                            {isPending ? (
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => onApprove(user.profile_id, currentuser.id)}
                                >
                                    Approve
                                </button>
                            ) : (
                                <>
                                    <Link to={"/manageUser/" + user.profile_id} className="btn btn-secondary me-2">Manage</Link>
                                    {user.inactive_at === null ? (
                                        <button type="button" className="btn btn-warning me-2" onClick={() => onDeactivate(user.profile_id)}>Deactivate</button>
                                    ) : (
                                        <button type="button" className="btn btn-info me-2" onClick={() => onReactivate(user.profile_id)}>Reactivate</button>
                                    )}
                                </>
                            )}
                        </td>
                    </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

function CoordinatorTable({ userlist, onDeactivate, onReactivate }) {
    return (
        <table className="table">
            <thead className="text-left">
                <tr className="text-left">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Locations</th>
                    <th className="p-3">Inactive</th>
                    <th className="p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {userlist.map((user) => {
                    const coordProfiles = user.coordinator_profiles || [];

                    return coordProfiles.length > 0 ? (
                        <tr key={user.profile_id} className="border-t">
                            <td className="p-3">{user.first_name} {user.last_name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.phone}</td>
                            <td className="p-3">
                                {coordProfiles.map((coord_profile) => {
                                    return (
                                        <div key={coord_profile.location_id} className="row">{coord_profile.venue_locations.location_name}</div>
                                    );
                                })}
                            </td>


                            <td className="p-3">
                                { // Changes incoming date format to '27 Nov 2025' format
                                    user.inactive_at === null
                                        ? "Active"
                                        : new Date(user.inactive_at).toLocaleDateString("en-AU", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                            </td>
                            <td>
                                <>
                                    
                                       <Link
                                            to={`/manageUser/${user.profile_id}`}
                                            className="btn btn-secondary me-2"
                                        >
                                            Manage
                                        </Link>
                                        {user.inactive_at === null ? (
                                            <button
                                                type="button"
                                                className="btn btn-warning me-2"
                                                onClick={() => onDeactivate(user.profile_id)}
                                            >
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-info me-2"
                                                onClick={() => onReactivate(user.profile_id)}
                                            >
                                                Reactivate
                                            </button>
                                        )}
                                   
                                </>
                            </td>
                        </tr>
                    ) : null;
                })}
            </tbody>
        </table>
    )
}

function AdminTable({ userlist, onDeactivate, onReactivate }) {
    return (
        <table className="table">
            <thead className="text-left">
                <tr className="text-left">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Admin Approval</th>
                    <th className="p-3">Inactive</th>
                    <th className="p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {userlist.map((user) => {
                    // Finds the approved user from their id
                    const adminProfiles = Array.isArray(user.admin_profiles)
                        ? user.admin_profiles
                        : user.admin_profiles
                            ? [user.admin_profiles]
                            : [];

                    const adminProfile = adminProfiles[0];
                    const admin_approver = adminProfile
                        ? userlist.find(
                            (u) => u.profile_id === adminProfile.approved_by
                        )
                        : null;


                    return user.role === "admin" ? (
                        <tr key={user.profile_id} className="border-t">
                            <td className="p-3">{user.first_name} {user.last_name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.phone}</td>
                            {!admin_approver ? (
                                <td className="p-3">Not yet approved</td>
                            ) : (
                                <td className="p-3">
                                    {admin_approver.first_name}{" "}
                                    {admin_approver.last_name}
                                </td>
                            )}

                            <td className="p-3">
                                { // Changes incoming date format to '27 Nov 2025' format
                                    user.inactive_at === null
                                        ? "Active"
                                        : new Date(user.inactive_at).toLocaleDateString("en-AU", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                            </td>
                            <td>
                                {/* Displays a variety of different buttons depending on whether the user is an admin or currently active/inactive */}
                                <>
                                    <Link
                                        to={`/manageUser/${user.profile_id}`}
                                        className="btn btn-secondary me-2"
                                    >
                                        Manage
                                    </Link>
                                    {user.inactive_at === null ? (
                                        <button
                                            type="button"
                                            className="btn btn-warning me-2"
                                            onClick={() => onDeactivate(user.profile_id)}
                                        >
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-info me-2"
                                            onClick={() => onReactivate(user.profile_id)}
                                        >
                                            Reactivate
                                        </button>
                                    )}
                                </>
                            </td>
                        </tr>
                    ) : null;
                })}
            </tbody>
        </table>
    );
}

export default function AdminViewUsers() {
    const { user, getActiveLink, handleLogout, closeOffcanvas } = useDashboardNav();
    const [userlist, setUserlist] = useState([]);
    const [searchrole, setSearchrole] = useState(() => {
        return sessionStorage.getItem('role') || 'pending';
    });

    const refreshUsers = async () => {
        try {
            const data = await fetchAllUsers();
            setUserlist(data || []);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {
        sessionStorage.setItem('role', searchrole);
    }, [searchrole]);

    // Stores the list of users from the database
    useEffect(() => {
        refreshUsers();
    }, []);

    // Filters users according to their role
    const filteredUsers = userlist.filter((u) => {
        if (searchrole === "pending") {
            return !u.approved_by;
        }
        if (searchrole === "all" || searchrole === "") {
            return true;
        }
        if (searchrole === "coordinator") {
            const coordProfiles = u.coordinator_profiles || [];
            return coordProfiles.length > 0;
        }
        return u.role === searchrole;
    });

    const filtereduserListLength = filteredUsers.length;

    const approveUser = async (newuserID, approverID) => {
        const { error: profileError } = await supabase
            .from("user_profiles")
            .update({
                approved_by: approverID,
                role: "listener",
            })
            .eq("profile_id", newuserID);

        if (profileError) {
            console.error("Failed to approve user: ", profileError.message);
            alert("Failed to approve user.");
            return;
        }

        await refreshUsers();
    };

    const deactivateUser = async (userID) => {
        const { error: profileError } = await supabase
            .from("user_profiles")
            .update({
                inactive_at: new Date(),
            })
            .eq("profile_id", userID);

        if (profileError) {
            console.error("Failed to deactivate user: ", profileError.message);
            alert("Failed to deactivate user.");
            return;
        }

        await refreshUsers();
    };

    const reactivateUser = async (userID) => {
        const { error: profileError } = await supabase
            .from("user_profiles")
            .update({
                inactive_at: null,
            })
            .eq("profile_id", userID);

        if (profileError) {
            console.error("Failed to reactivate user: ", profileError.message);
            alert("Failed to reactivate user.");
            return;
        }

        await refreshUsers();
    };


    return (
        <div className="container-fluid px-0">
            <div className="d-lg-none p-2">
                <button
                    className="btn btn-outline-primary btn-lg"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileMenu"
                    aria-controls="mobileMenu"
                >
                    Menu
                </button>
            </div>

            <div className="d-flex">
                {/* Sidebar */}
                <aside className="px-0 flex-shrink-0">
                    <AdminSidebar />
                </aside>

                {/* Right content area */}
                <div className="d-flex flex-grow-1 dashboard-page-content overflow-auto"  >
                    <div className="flex-grow-1 px-3 px-md-4 py-4">

                        <h2 className="fw-bold dashboard-title fs-3 mb-4">View All Users</h2>

                        {/* Dropdown menu to refine the displayed users */}
                        <div className="mb-3">
                            <select className="form-select fw-semibold mb-2 w-auto"
                                value={searchrole}
                                name="roles"
                                onChange={(e) => setSearchrole(e.target.value)}>
                                <option value="pending">Pending Users</option>
                                <option value="listener">Listener</option>
                                <option value="coordinator">Coordinators</option>
                                <option value="admin">Admins</option>
                                <option value="all">All Users</option>
                            </select>
                        </div>

                      
                            { filtereduserListLength === 0 ? (
                                <h5 className="text-center">
                                    No {searchrole} users found.
                                </h5>
                            ) : searchrole === "admin" ? (
                                <AdminTable
                                    userlist={filteredUsers}
                                    onDeactivate={deactivateUser}
                                    onReactivate={reactivateUser}
                                />
                            ) : searchrole === "coordinator" ? (
                                <CoordinatorTable
                                    userlist={filteredUsers}
                                    onDeactivate={deactivateUser}
                                    onReactivate={reactivateUser}
                                />
                            ) : (
                                <UserTable
                                    userlist={filteredUsers}
                                    currentuser={user}
                                    onApprove={approveUser}
                                    onDeactivate={deactivateUser}
                                    onReactivate={reactivateUser}
                                />
                            )}
                    </div>
                </div>
            </div>
            <div
                className="offcanvas offcanvas-start"
                id="mobileMenu"
                tabIndex="-1"
                aria-labelledby="mobileMenuLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="mobileMenuLabel" className="mb-0">
                        Hello, {user?.firstName ?? ""}!
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">

                    <AdminLinks
                        getActiveLink={getActiveLink}
                        handleLogout={handleLogout}
                        onItemClick={closeOffcanvas}
                    />
                </div>
            </div>
        </div>
    );
}