import React, { useState } from 'react';
import { generateTest } from '../services/test.api';
import LiveTest from '../components/LiveTest';
import TestResult from '../components/TestResult';
import { Zap, Play, Layers, Sliders, CheckSquare, Square } from 'lucide-react';

const Home = () => {
    // Mode: 'setup' | 'live' | 'result'
    const [mode, setMode] = useState('setup');
    const [activeTestData, setActiveTestData] = useState(null);
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Generator Form State
    const [selectedTopics, setSelectedTopics] = useState([
        'Quantitative Aptitude',
        'Logical Reasoning',
        'Verbal Ability'
    ]);
    const [difficulty, setDifficulty] = useState('medium');
    const [questionCount, setQuestionCount] = useState(15);
    const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);

    const availableTopics = [
        'Quantitative Aptitude',
        'Logical Reasoning',
        'Verbal Ability'
    ];

    const toggleTopic = (topic) => {
        if (selectedTopics.includes(topic)) {
            if (selectedTopics.length > 1) {
                setSelectedTopics(selectedTopics.filter((t) => t !== topic));
            }
        } else {
            setSelectedTopics([...selectedTopics, topic]);
        }
    };

    const handleLaunchCustom = async () => {
        setError('');
        setLoading(true);
        try {
            const data = await generateTest({
                topics: selectedTopics,
                difficulty,
                questionCount: Number(questionCount),
                timeLimitMinutes: Number(timeLimitMinutes)
            });
            setActiveTestData(data);
            setMode('live');
        } catch (err) {
            setError(err.message || 'Failed to generate test');
        } finally {
            setLoading(false);
        }
    };

    const handleLaunchPreset = async (preset) => {
        setError('');
        setLoading(true);
        try {
            const data = await generateTest(preset);
            setActiveTestData(data);
            setMode('live');
        } catch (err) {
            setError(err.message || 'Failed to launch preset test');
        } finally {
            setLoading(false);
        }
    };

    const handleTestFinished = (result) => {
        setTestResult(result);
        setMode('result');
    };

    const handleReset = () => {
        setMode('setup');
        setActiveTestData(null);
        setTestResult(null);
    };

    if (mode === 'live' && activeTestData) {
        return <LiveTest testData={activeTestData} onTestFinished={handleTestFinished} />;
    }

    if (mode === 'result' && testResult) {
        return <TestResult result={testResult} onReset={handleReset} />;
    }

    return (
        <div>
            <div className="page-title-block">
                <h1>Mock Test Generator</h1>
                <p>Configure quick aptitude tests or launch one-click presets.</p>
            </div>

            {error && <div className="alert-error">{error}</div>}

            {/* Presets Row */}
            <div className="dashboard-card">
                <span className="section-label">Quick Presets</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Launch instant pre-configured mock tests in one click.
                </p>

                <div className="presets-grid">
                    <div className="preset-card">
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Sprint</span>
                            <h3>15-min Quant Sprint</h3>
                            <p>10 Arithmetic & Algebra questions designed for quick practice.</p>
                        </div>
                        <div className="preset-footer">
                            <span className="preset-meta">10 Qs • 15 mins</span>
                            <button
                                onClick={() => handleLaunchPreset({
                                    topics: ['Quantitative Aptitude'],
                                    difficulty: 'medium',
                                    questionCount: 10,
                                    timeLimitMinutes: 15
                                })}
                                disabled={loading}
                                className="btn-primary"
                                style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                            >
                                <Play size={14} /> Launch
                            </button>
                        </div>
                    </div>

                    <div className="preset-card">
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>Logic Focus</span>
                            <h3>30-min Logic Booster</h3>
                            <p>20 Puzzles, Syllogisms, and Reasoning questions.</p>
                        </div>
                        <div className="preset-footer">
                            <span className="preset-meta">20 Qs • 30 mins</span>
                            <button
                                onClick={() => handleLaunchPreset({
                                    topics: ['Logical Reasoning'],
                                    difficulty: 'medium',
                                    questionCount: 20,
                                    timeLimitMinutes: 30
                                })}
                                disabled={loading}
                                className="btn-primary"
                                style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', background: '#10b981' }}
                            >
                                <Play size={14} /> Launch
                            </button>
                        </div>
                    </div>

                    <div className="preset-card">
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Full Mock</span>
                            <h3>45-min Full Aptitude</h3>
                            <p>30 Mixed questions across Quant, Logic, and Verbal domains.</p>
                        </div>
                        <div className="preset-footer">
                            <span className="preset-meta">30 Qs • 45 mins</span>
                            <button
                                onClick={() => handleLaunchPreset({
                                    topics: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'],
                                    difficulty: 'medium',
                                    questionCount: 30,
                                    timeLimitMinutes: 45
                                })}
                                disabled={loading}
                                className="btn-primary"
                                style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', background: '#f59e0b' }}
                            >
                                <Play size={14} /> Launch
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Config Card */}
            <div className="dashboard-card">
                <span className="section-label">Custom Test Suite</span>

                {/* 1. Topics */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>1. Select Aptitude Topics</label>
                    <div className="topics-grid">
                        {availableTopics.map((topic) => {
                            const isChecked = selectedTopics.includes(topic);
                            return (
                                <div
                                    key={topic}
                                    className={`topic-card ${isChecked ? 'selected' : ''}`}
                                    onClick={() => toggleTopic(topic)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => { }}
                                    />
                                    <span>{topic}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Difficulty */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>2. Cognitive Difficulty</label>
                    <div className="difficulty-options">
                        {['easy', 'medium', 'hard'].map((d) => (
                            <button
                                key={d}
                                type="button"
                                className={`diff-btn ${difficulty === d ? 'selected' : ''}`}
                                onClick={() => setDifficulty(d)}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Duration & Questions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
                            Question Count ({questionCount})
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            step="5"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(e.target.value)}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                            <span>5 Qs</span>
                            <span>25 Qs</span>
                            <span>50 Qs</span>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
                            Time Limit ({timeLimitMinutes} mins)
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="90"
                            step="5"
                            value={timeLimitMinutes}
                            onChange={(e) => setTimeLimitMinutes(e.target.value)}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                            <span>10m</span>
                            <span>45m</span>
                            <span>90m</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLaunchCustom}
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', padding: '0.9rem', justifyContent: 'center', fontSize: '1rem' }}
                >
                    <Play size={18} /> {loading ? 'Generating Dynamic Test...' : 'Start Custom Mock Test'}
                </button>
            </div>
        </div>
    );
};

export default Home;
