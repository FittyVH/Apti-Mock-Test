import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Protected = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'var(--bg-dark)',
                color: 'var(--text-muted)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Loading session...</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Please wait</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/landing" replace />;
    }

    return children;
};

export default Protected;