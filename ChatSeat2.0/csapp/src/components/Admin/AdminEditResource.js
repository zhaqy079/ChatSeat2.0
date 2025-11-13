import AdminSidebar from './AdminSidebar';
import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import AdminLinks from "./AdminLinks";
import { useDashboardNav } from "../Shared/useDashboardNav";

export default function AdminEditResource() {
    const { user, getActiveLink, handleLogout, closeOffcanvas } = useDashboardNav();

    const [resources, setResources] = useState([]);
    const [newResource, setNewResource] = useState({ role: "listener", content: "", link: "" });

    // Fetch all resources
    const fetchResources = async () => {
        const { data, error } = await supabase.from("role_resources").select("*").order("created_at", { ascending: false });
        if (error) console.error(error);
        else setResources(data);
    };

    useEffect(() => {
        fetchResources();
    }, []);

    // Add new resource 
    const handleAdd = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from("role_resources").insert([newResource]);
        if (error) console.error(error);
        else {
            setNewResource({ role: "listener", content: "", link: "" });
            fetchResources();
        }
    };

    // Delete resource
    const handleDelete = async (id) => {
        const { error } = await supabase.from("role_resources").delete().eq("resource_id", id);
        if (error) console.error(error);
        else fetchResources();
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


                <div className="flex-grow-1 px-3 px-md-4 py-4">
                    <h2 className="fw-bold dashboard-title fs-3 mb-4">Edit Listener External Resources</h2>

                    <form onSubmit={handleAdd} className="mb-4">
                        <div className="mb-3">
                            <label className="form-label">Role</label>
                            <input
                                type="text"
                                name="enterRole"
                                className="form-control"
                                value={newResource.role}
                                onChange={(e) => setNewResource({ ...newResource, role: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Content Title</label>
                            <input
                                type="text"
                                name="contentTitle"
                                className="form-control"
                                value={newResource.content}
                                onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Link URL</label>
                            <input
                                type="url"
                                className="form-control"
                                name="resourceUrl"
                                value={newResource.link}
                                onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Resource</button>
                    </form>

                    <h5 className="fw-bold mb-3">Existing Resources</h5>
                    <ul className="list-group">
                        {resources.map((r) => (
                            <li key={r.resource_id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{r.content}</strong> - <a href={r.link} target="_blank" rel="noreferrer">{r.link}</a>
                                    <br />
                                    <small className="text-muted">Role: {r.role}</small>
                                </div>
                                <button onClick={() => handleDelete(r.resource_id)} className="btn btn-sm btn-danger">
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
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

