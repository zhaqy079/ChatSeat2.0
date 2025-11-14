import { supabase } from "./supabaseClient";
import { setloggedInUserSuccess } from "./state/loggedInUser"; 


export async function restoreSessionAndHydrateRedux(dispatch) { 
    // Skip restoring if user is on the reset password page
    const path = window.location.pathname;
    if (path === "/reset-password") {
       
        return;
    }
    // Get the current user/session
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
       
        return;
    }
    if (!user) {
        
        return;
    }

    // Load profile (includes role) by email 
    const { data: profile, error: profErr } = await supabase
        .from("user_profiles")
        .select("first_name,last_name,email,role")
        .eq("email", user.email)
        .maybeSingle(); 

    if (profErr) {
        console.warn("profile load warn:", profErr.message);
    }

    // Prefer table role; fallback to user_metadata; final fallback 'listener'
    const role =
        (profile?.role || user?.user_metadata?.role || "listener").toLowerCase();

    // Dispatch to Redux in the shape your app expects
    dispatch(
        setloggedInUserSuccess({
            id: user.id,
            email: user.email,
            firstName: profile?.first_name ?? null,
            lastName: profile?.last_name ?? null,
            role,
        })
    );
}
