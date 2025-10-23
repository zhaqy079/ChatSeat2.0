import CoordinatorSidebar from "./CoordinatorSidebar";
import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
//import { useSelector } from "react-redux";

const supabase = createClient(
    "https://nuarimunhutwzmcknhwj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51YXJpbXVuaHV0d3ptY2tuaHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTk2MjIsImV4cCI6MjA3MTIzNTYyMn0.fwdTA0n_vSrT_kUqlExIPdDpPrHo_fRIkOUcd5aHi0c"
);

export default function CoordinatorHelp() {
    const [activeTab, setActiveTab] = useState(0);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const tabs = ["Help Page", "How to Attract Listeners", "Lessons Learned", "Image Gallery"];

    // Fetch images for the gallery
    useEffect(() => {
        if (activeTab === 3) {
            fetchImages();
        }
    }, [activeTab]);

    const fetchImages = async () => {
        const { data, error } = await supabase.storage
            .from("coordinator-images")
            .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

        if (error) {
            console.error("Failed to fetch images:", error);
            return;
        }

        const signed = await Promise.all(
            data.map(async (file) => {
                const { data: signedUrl } = await supabase.storage
                    .from("coordinator-images")
                    .createSignedUrl(file.name, 300);
                return { name: file.name, url: signedUrl?.signedUrl };
            })
        );

        setFiles(signed);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const fileName = `${Date.now()}_${file.name}`;

        const { error } = await supabase.storage
            .from("coordinator-images")
            .upload(fileName, file);

        if (error) {
            console.error(error);
            alert("Upload failed.");
        } else {
            alert("Upload successful!");
            fetchImages();
        }

        setUploading(false);
    };

    const handleDelete = async (fileName) => {
        const { error } = await supabase.storage
            .from("coordinator-images")
            .remove([fileName]);

        if (error) {
            console.error(error);
            alert("Failed to delete image.");
        } else {
            alert("Image deleted!");
            fetchImages();
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return (
                    <div className="container bg-white rounded shadow-sm p-4 p-md-5 text-dark">
                        <div className="text-center mb-5">
                            <h2 className="fw-bold text-primary mb-2">How to Use the Website</h2>
                            <p>
                                A quick guide to help you navigate and use the dashboard effectively.
                            </p>
                        </div>
                        <div className="row g-4">
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-primary bg-primary-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">Appointments</h5>
                                    <p>
                                        This page shows all your booked sessions with listeners. If necessary, you
                                        can <strong>Edit</strong> time, place or date, or <strong>delete</strong> any
                                        slot that’s no longer available or needed.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-success bg-success-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">Availability</h5>
                                    <p>
                                        View all scheduled sessions on a calendar. This helps you keep track of your
                                        availability and upcoming appointments visually.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-warning bg-warning-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">Resources</h5>
                                    <p>
                                        Access important materials, guides, or tools curated specifically to help
                                        coordinators deliver better support. <br />
                                        Download official banners and logos for events or communication material.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-info bg-info-subtle shadow-sm">
                                    <h5 className="fw-semibold">Chatrooms</h5>
                                    <p>
                                        Engage in discussions with either <strong>listeners</strong> or other{" "}
                                        <strong>coordinators</strong>. These spaces offer a safe place to share tips
                                        or get clarifications.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-danger bg-danger-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">Feedback</h5>
                                    <p>
                                        Just like listeners, coordinators can also share feedback. Whether it's about
                                        a session or an idea for improvement, your input is valued.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="container bg-white rounded shadow-sm p-4 p-md-5 text-dark w-50">
                        <h2 className="text-primary fw-bold mb-4">
                            How to Attract Volunteer Listeners
                        </h2>
                        <div className="p-4 rounded border border-2 border-primary-subtle bg-primary-subtle shadow-sm">
                            <p className="mb-3"><strong>Volunteer Callout – Chat Seats</strong></p>
                            <p className="mb-4">
                                We are looking for volunteers who enjoy listening to others and want to
                                help create a connected, supportive community through Chat Seats.
                            </p>
                            <p className="mb-3"><strong>About the Chat Seat</strong></p>
                            <p className="mb-4">
                                We’ll be setting up a Chat Seat in your chosen venue. Its purpose is to help
                                community members connect through conversation.
                            </p>
                            <p className="mb-3"><strong>What’s Involved</strong></p>
                            <p className="mb-0">
                                Volunteers will spend time listening at the Chat Seat. This helps people who
                                may be lonely feel heard and supported.
                            </p>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="container bg-white rounded shadow-sm p-4 p-md-5 text-dark mx-auto w-50">
                        <h2 className="text-primary fw-bold mb-4">
                            Lessons Learned in Establishing Chat Seats
                        </h2>
                        <p>
                            Below are some of the lessons we have learned when establishing{" "}
                            <strong>Chat Seats</strong>:
                        </p>
                        <div className="p-4 rounded border border-2 border-primary-subtle bg-primary-subtle shadow-sm">
                            <ul className="list-disc ps-4 mb-0">
                                <li>Ensure listeners are genuinely interested and have strong listening skills.</li>
                                <li>Pair new listeners with an experienced one.</li>
                                <li>Keep focus on listening, not counselling.</li>
                                <li>Prepare banners and graphics for venues.</li>
                                <li>Be flexible with location and setup style.</li>
                                <li>Comply with venue requirements and clearances.</li>
                                <li>Regularly check in with the venue manager.</li>
                                <li>Advertise Chat Seat availability on the website.</li>
                                <li>Host biannual get-togethers for listeners.</li>
                                <li>Encourage intergenerational participation.</li>
                                <li>Provide materials to build listening skills.</li>
                                <li>Wear a name badge (“Hello my name is ...”).</li>
                                <li>Offer tea/coffee if possible.</li>
                                <li>Encourage venues to promote Chat Seats.</li>
                            </ul>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="container bg-white rounded shadow-sm p-4 p-md-5 text-dark">
                        <h3 className="fw-bold text-primary mb-3">Image Gallery</h3>
                        <input type="file" onChange={handleUpload} disabled={uploading} className="mb-4" />
                        {uploading && <p className="text-blue-500">Uploading...</p>}
                        <div className="row g-4">
                            {files.length === 0 && <p className="text-center">No images found.</p>}
                            {files.map((file) => (
                                <div key={file.name} className="col-12 col-md-4">
                                    <div className="p-2 border rounded shadow-sm bg-white">
                                        <img src={file.url} alt={file.name} className="mb-2 w-full h-auto" />
                                        <p className="text-sm break-words">{file.name}</p>
                                        <div className="flex space-x-2">
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                                            <button onClick={() => handleDelete(file.name)} className="text-red-600 hover:underline">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="d-flex dashboard-page-content">
            <CoordinatorSidebar />
            <div className="flex-grow-1 px-3 px-md-5 py-4 justify-content-center">
                <div className="w-100 d-flex flex-wrap justify-content-center gap-3 mb-4 border-bottom pb-2">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setActiveTab(index)}
                            className={`tab-button fw-semibold ${activeTab === index
                                ? "text-light bg-primary"
                                : "text-primary bg-light"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                {renderTabContent()}
            </div>
        </div>
    );
}