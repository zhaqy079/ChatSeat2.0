import { NavLink } from "react-router-dom";

export default function AdminLinks({ getActiveLink, onItemClick, handleLogout }) {
  return (
    <>
      <div className="dashboard-sidebar__nav">

        <NavLink
          to="/admindashboard"
          className={getActiveLink("/admindashboard")}
          onClick={onItemClick}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/adminSchedulingSetting"
          className={getActiveLink("/adminSchedulingSetting")}
          onClick={onItemClick}
        >
          Location Scheduling
        </NavLink>

        <NavLink
          to="/adminViewUsers"
          className={getActiveLink("/adminViewUsers")}
          onClick={onItemClick}
        >
          Manage Users
        </NavLink>

        <NavLink
          to="/admineditresource"
          className={getActiveLink("/admineditresource")}
          onClick={onItemClick}
        >
          Edit Resources
        </NavLink>

        <NavLink
          to="/adminlistenerchatroom"
          className={getActiveLink("/adminlistenerchatroom")}
          onClick={onItemClick}
        >
          Listener Chatroom
        </NavLink>

        <NavLink
          to="/admincoordinatorchatroom"
          className={getActiveLink("/admincoordinatorchatroom")}
          onClick={onItemClick}
        >
          Coordinator Chatroom
        </NavLink>

        <NavLink
          to="/adminFeedback"
          className={getActiveLink("/adminFeedback")}
          onClick={onItemClick}
        >
          Manage Feedback
        </NavLink>
      </div>
      <hr />
      <div className="mt-3">
        <button
          className="dashboard-sidebar__logout"
          onClick={() => {
            onItemClick && onItemClick();
            handleLogout();
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
}