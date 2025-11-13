import UserGeneralForum from "../Shared/UserGeneralForum";
import ListenerSideBar from "./ListenerSideBar";
import ListenerLinks from "./ListenerLinks";
import { useDashboardNav } from "../Shared/useDashboardNav";

export default function ListenerChatroom() {
    const { user, getActiveLink, handleLogout, closeOffcanvas } = useDashboardNav();

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

            <div className="d-flex dashboard-page-content">
                {/* Sidebar */}
                <aside className="px-0 flex-shrink-0">
                    <ListenerSideBar />
                </aside>

                {/* Right content area */}
                <UserGeneralForum />

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

