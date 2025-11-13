import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../supabaseClient";
import { logoutUser } from "../../state/loggedInUser";
import { useEffect } from "react";

export function useDashboardNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.loggedInUser?.success);

  const getActiveLink = (url) =>
    location.pathname === url
      ? "dashboard-sidebar__link active"
      : "dashboard-sidebar__link";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logoutUser());
    navigate("/");
  };

  const closeOffcanvas = () => {
    const el = document.getElementById("mobileMenu");
    if (el) {
      const inst = window.bootstrap?.Offcanvas.getInstance(el);
      if (inst) inst.hide();
    }
    document.body.style.overflow = "";
    document.body.classList.remove("offcanvas-backdrop", "offcanvas-open");
  };

  useEffect(() => {
    const el = document.getElementById("mobileMenu");
    if (el) {
      const inst = window.bootstrap?.Offcanvas.getInstance(el);
      if (inst) inst.hide();
    }
    document.body.style.overflow = "";
    document.body.classList.remove("offcanvas-backdrop", "offcanvas-open");
  }, [location.pathname]);


  return {
    user,
    getActiveLink,
    handleLogout,
    closeOffcanvas,
  };
}