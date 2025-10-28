import ListenerSidebar from "./ListenerSideBar";

export default function MakePeopleComfortable() {


    return (
        <div>

            <div className="d-flex">
                {/* Sidebar */}
                <div className="col-12 col-md-3 col-lg-3">
                    <ListenerSidebar />
                </div>

                {/* Main Content */}
                <main className="ms-md-3 p-4">
                    <div className="text-black mx-auto" style={{ maxWidth: "960px" }}>
                        {/* Two cards side by side */}
                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <div className="card border-primary bg-primary-subtle p-3 h-100">
                                    <h5 className="card-title text-primary mb-3">1. Open Seating</h5>
                                    <ul className="ms-3">
                                        <li>Have the seating set up so it is easily accessible to another person(s).</li>
                                        <li>Place the banner to the side so the Listeners are visible.</li>
                                        <li>Be positioned where there is a lot of foot traffic and highly visible.</li>
                                        <li>Have tea/coffee available if possible.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="card border-info bg-info-subtle p-3 h-100">
                                    <h5 className="card-title text-info mb-3">2. As Listeners</h5>
                                    <ul className="ms-3">
                                        <li>Make eye contact with individuals passing by.</li>
                                        <li>Smile at anyone who is nearby.</li>
                                        <li>Be welcoming and friendly.</li>
                                        <li>Say "Hi/Hello/Good morning etc." to those nearby.</li>
                                        <li>Invite them to sit down and grab a coffee or tea if available.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Text section below cards */}
                        <div className="mt-4 text-center text-secondary px-3">
                            <p>
                                We hope that you find this guide sheet helpful. If you have suggestions on how it could be improved, let us know.
                            </p>
                            <p>
                                Thank you for taking the time to support your local community through chatting with some of its members. We hope that you will be able to commit to further "Chat" time in the future.
                            </p>
                            <p className="fst-italic fw-semibold mt-3">
                                Connecting Through Conversation
                            </p>
                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
}