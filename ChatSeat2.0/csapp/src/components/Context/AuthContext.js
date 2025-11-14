import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../../supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.error("Error fetching session:", sessionError);
                setUser(null);
                setLoading(false);
                return;
            }

            if (!session?.user) {
                setUser(null);
                setLoading(false);
                return;
            }

            // Fetch the role from user_profiles
            const { data: profile, error: profileError } = await supabase
                .from("user_profiles")
                .select("role")
                .eq("email", session.user.email)
                .single();

            if (profileError) {
                console.warn("Error fetching profile:", profileError.message);
            }

            setUser({
                ...session.user,
                role: profile?.role || "listener", 
            });
            setLoading(false);
        };

        loadSession();

        // Listen for auth state changes for login/logout
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session?.user) {
                setUser(null);
                setLoading(false);
                return;
            }

            // Fetch role again on login
            supabase
                .from("user_profiles")
                .select("role")
                .eq("email", session.user.email)
                .single()
                .then(({ data: profile, error }) => {
                    if (error) console.warn("Error fetching profile:", error.message);
                    setUser({
                        ...session.user,
                        role: profile?.role || "listener",
                    });
                    setLoading(false);
                });
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
