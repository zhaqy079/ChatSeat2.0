import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {

    return (
        <div>
            <AdminNavbar title="Admin Dashboard" />

            <div
                className="d-flex"
            >

                <AdminSidebar userName="userName" />


                <main className="flex-grow-1 p-4">
                    
                </main>
            </div>
        </div>


    );
}