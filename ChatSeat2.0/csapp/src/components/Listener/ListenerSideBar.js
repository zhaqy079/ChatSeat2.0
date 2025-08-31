import { NavLink } from "react-router-dom";

export default function ListenerSidebar() {
    const linkCls = ({ isActive }) =>
        "list-group-item list-group-item-action rounded-pill mb-2 text-center " +
        (isActive ? "active" : "");

    return (
        <aside className="p-3" style={{ width: 260, background: "#A8E4F2" }}>
            <div className="list-group border-0">
                <NavLink to="/coordinatorslistinlistener" className={linkCls}>
                    List of Coordinators
                </NavLink>
                <NavLink to="/listenerscheduling" className={linkCls}>
                    Scheduling
                </NavLink>
                <NavLink to="/listenerchatroom" className={linkCls}>
                    Let’s Talk
                </NavLink>
            </div>
        </aside>
    );
}
