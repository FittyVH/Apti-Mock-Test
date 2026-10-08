import React, { useState, useEffect } from 'react';
import { getProfileStats } from '../services/test.api';
import { User, Mail, Award } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfileStats();
                setProfile(data.user || {});
            } catch (err) {
                setError(err.message || 'Failed to fetch profile info');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div style={{ color: 'var(--text-muted)' }}>Loading profile...</div>;
    }

    return (
        <div>
            <div className="page-title-block">
                <h1>Profile</h1>
                <p>Your basic account details and overall statistics.</p>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div className="profile-card">
                <div className="profile-avatar">
                    {(profile?.username || 'U').charAt(0).toUpperCase()}
                </div>

                <div className="profile-field">
                    <div className="field-label">Full Name / Username</div>
                    <div className="field-val">{profile?.username || 'User'}</div>
                </div>

                <div className="profile-field">
                    <div className="field-label">Email Address</div>
                    <div className="field-val">{profile?.email || 'N/A'}</div>
                </div>

                <div className="profile-field" style={{ marginBottom: 0 }}>
                    <div className="field-label">Tests Taken</div>
                    <div className="field-val" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>
                        {profile?.testsTaken || 0}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
