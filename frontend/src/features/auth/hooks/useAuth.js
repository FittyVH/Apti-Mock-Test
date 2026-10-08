import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const { user, setUser, loading, setLoading } = context;
    const [authError, setAuthError] = useState(null);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        setAuthError(null);
        try {
            const data = await login({ email, password });
            if (data?.user) {
                setUser(data.user);
                return data.user;
            }
        } catch (err) {
            setAuthError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        setAuthError(null);
        try {
            const data = await register({ username, email, password });
            if (data?.user) {
                setUser(data.user);
                return data.user;
            }
        } catch (err) {
            setAuthError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const checkUser = async () => {
            try {
                const data = await getMe();
                if (isMounted) {
                    if (data?.user) {
                        setUser(data.user);
                    } else {
                        setUser(null);
                    }
                }
            } catch (err) {
                if (isMounted) setUser(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        checkUser();
        return () => {
            isMounted = false;
        };
    }, []);

    return { user, loading, authError, setAuthError, handleRegister, handleLogin, handleLogout };
};