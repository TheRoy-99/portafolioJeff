import { useState, useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const [checking, setChecking] = useState(true);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setAuthed(!!data.session);
            setChecking(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthed(!!session);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    if (checking) return null;
    if (!authed) return <Navigate to="/admin/login" replace />;

    return <>{children}</>;
};