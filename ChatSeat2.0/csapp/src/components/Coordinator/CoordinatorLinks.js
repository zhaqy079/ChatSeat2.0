import { NavLink } from "react-router-dom";

export default function CoordinatorLinks({ getActiveLink, onItemClick, handleLogout }) {
  return (
    <>
      <div className="dashboard-sidebar__nav">

        <NavLink to="/coordinatordashboard"
          className={getActiveLink("/coordinatordashboard")}
          onClick={onItemClick}>
          Dashboard
        </NavLink>

        <NavLink to="/coordinatorappointments"
          className={getActiveLink("/coordinatorappointments")}
          onClick={onItemClick}>
          Appointments
        </NavLink>

        <NavLink to="/coordinatoravailability"
          className={getActiveLink("/coordinatoravailability")}
          onClick={onItemClick}>
          Availability
        </NavLink>

        <NavLink to="/coordinatorlistenerchatroom"
          className={getActiveLink("/coordinatorlistenerchatroom")}
          onClick={onItemClick}>
          Listener Chatroom
        </NavLink>

        <NavLink to="/coordinatoradminforum"
          className={getActiveLink("/coordinatoradminforum")}
          onClick={onItemClick}>
          Coordinator Chatroom
        </NavLink>



        <NavLink to="/coordFeedback"
          className={getActiveLink("/coordFeedback")}
          onClick={onItemClick}>
          Feedback
        </NavLink>

      </div>
      <hr />
      <div className="mt-3">
        <button className="dashboard-sidebar__logout"
          onClick={() => { handleLogout(); onItemClick && onItemClick(); }}>
          Logout
        </button>
      </div>
    </>
  );
}