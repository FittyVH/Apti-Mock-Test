import React from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, ArrowRight, ShieldCheck, Zap, BarChart2 } from 'lucide-react';

const Landing = () => {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (user) return <Navigate to="/" replace />;

    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="brand-title">
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        background: 'var(--primary)',
                        borderRadius: 6,
                        color: '#fff',
                        fontWeight: 700
                    }}>A</span>
                    <span>[ AptiMock AI ]</span>
                </div>
                <div className="nav-actions">
                    <Link to="/login" className="btn-secondary">Sign In</Link>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            <main className="landing-hero">
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--primary-light)',
                    color: '#a5b4fc',
                    padding: '0.4rem 1rem',
                    borderRadius: '50px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                }}>
                    <Sparkles size={16} /> Next-Gen AI Aptitude Assessment Engine
                </div>

                <h1>Master Aptitude Tests with Dynamic AI Mocks</h1>
                <p>
                    Generate customizable aptitude test suites, track your detailed test history, and get real-time AI performance diagnostics.
                </p>

                <div className="hero-buttons">
                    <Link to="/register" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                        Create Account <ArrowRight size={18} />
                    </Link>
                    <Link to="/login" className="btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                        Sign In
                    </Link>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.5rem',
                    maxWidth: '850px',
                    width: '100%',
                    marginTop: '4rem',
                    textAlign: 'left'
                }}>
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        <Zap color="#6366f1" size={24} style={{ marginBottom: '0.75rem' }} />
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>Instant Presets</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Launch 15m, 30m, or 45m speed tests with one click.</p>
                    </div>

                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        <BarChart2 color="#10b981" size={24} style={{ marginBottom: '0.75rem' }} />
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>AI Diagnostics</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Receive clear evaluation feedback on every submitted test.</p>
                    </div>

                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        <ShieldCheck color="#f59e0b" size={24} style={{ marginBottom: '0.75rem' }} />
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>Saved Questions</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bookmark challenging questions during test taking for review.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;
