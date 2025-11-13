import { NavLink } from "react-router-dom";

export default function ListenerLinks({ getActiveLink, onItemClick, handleLogout }) {
  return (
    <>
      <div className="dashboard-sidebar__nav">

        <NavLink to="/listenerdashboard"
          className={getActiveLink("/listenerdashboard")}
          onClick={onItemClick}>
          Dashboard
        </NavLink>

        <NavLink to="/coordinatorslistinlistener"
          className={getActiveLink("/coordinatorslistinlistener")}
          onClick={onItemClick}>
          List of Coordinators
        </NavLink>

        <NavLink to="/listenerscheduling"
          className={getActiveLink("/listenerscheduling")}
          onClick={onItemClick}>
          Scheduling
        </NavLink>

        <NavLink to="/listenerchatroom"
          className={getActiveLink("/listenerchatroom")}
          onClick={onItemClick}>
          Let’s Talk
        </NavLink>

        <NavLink to="/privatemessage"
          className={getActiveLink("/privatemessage")}
          onClick={onItemClick}>
          Inbox
        </NavLink>


        <NavLink to="/listenerFeedback"
          className={getActiveLink("/listenerFeedback")}
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