import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
    const { handleLogin, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await handleLogin({ email, password });
            navigate('/');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="brand-header">
                    <div className="brand-logo-badge">A</div>
                    <h2>[ Brand Name ]</h2>
                    <p className="brand-sub">APTITUDE MOCK ENGINE</p>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-main)' }}>
                    Sign in to your account
                </h3>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
