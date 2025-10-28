import ListenerSidebar from "./ListenerSideBar";


export default function ListeningSkills() {


    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="col-12 col-md-3 col-lg-3">
                <ListenerSidebar />
            </div>

            {/* Main Content */}
            <main className="flex-grow-1 ms-md-3 p-4">
                <h2 className="fw-bold text-primary mb-3 text-center">
                    Chat Seats - Listener Guide
                </h2>
                <p className="text-center text-secondary mb-5">
                    Connecting Through Conversation
                </p>

                <div className="d-flex flex-wrap justify-content-center gap-3">
                    <div className="card border-primary bg-primary-subtle p-3 m-2">
                        <h5 className="card-title text-primary">1. Active Listening</h5>
                        <ul className="ms-3">
                            <li>Listen attentively without interrupting.</li>
                            <li>Validate their feelings and experiences.</li>
                        </ul>
                    </div>

                    <div className="card border-success bg-success-subtle p-3 m-2">
                        <h5 className="card-title text-success">2. Empathy and Support</h5>
                        <ul className="ms-3">
                            <li>Respond with empathy and understanding.</li>
                            <li>Encourage them to express themselves freely.</li>
                        </ul>
                    </div>

                    <div className="card border-warning bg-warning-subtle p-3 m-2">
                        <h5 className="card-title text-warning">3. Maintain Boundaries</h5>
                        <ul className="ms-3">
                            <li>Understand your limits in providing support.</li>
                            <li>Avoid personal advice; focus on facilitating conversation.</li>
                        </ul>
                    </div>

                    <div className="card border-secondary bg-secondary-subtle p-3 m-2">
                        <h5 className="card-title text-secondary">Best Practices</h5>
                        <ul className="ms-3">
                            <li><strong>Confidentiality:</strong> Maintain strict confidentiality about all conversations.</li>
                            <li><strong>Respect Differences:</strong> Be aware of and respect cultural, gender, age, social, and personal differences.</li>
                        </ul>
                    </div>

                    <div className="card border-danger bg-danger-subtle p-3 m-2">
                        <h5 className="card-title text-danger">If Something Seems Not Right</h5>
                        <ul className="ms-3">
                            <li>Remain calm and ensure they feel heard.</li>
                            <li>Ask them if they are okay?</li>
                            <li>Ask if they would like you to contact someone.</li>
                            <li>If needed, contact local crisis services or emergency contacts for immediate support.</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-5 text-center text-secondary px-3">
                    <p>We hope that you find this guide sheet helpful.</p>
                    <p>
                        Thank you for taking the time to support your local community
                        through chatting with some of its members. We hope that you will
                        be able to commit to further "Chat" time in the future.
                    </p>
                </div>
            </main>
        </div>
    );
}
