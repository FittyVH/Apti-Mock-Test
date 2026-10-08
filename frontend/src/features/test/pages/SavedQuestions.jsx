import React, { useState, useEffect } from 'react';
import { getSavedQuestions } from '../services/test.api';
import { Bookmark, CheckCircle } from 'lucide-react';

const SavedQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getSavedQuestions();
                setQuestions(data.questions || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch saved questions');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const renderSafeVal = (val) => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'string' || typeof val === 'number') return String(val);
        if (typeof val === 'object') {
            return val.text ? `${val.key ? val.key + ': ' : ''}${val.text}` : (val.text || val.value || val.key || JSON.stringify(val));
        }
        return String(val);
    };

    return (
        <div>
            <div className="page-title-block">
                <h1>Saved Questions</h1>
                <p>Review questions you bookmarked during test analysis.</p>
            </div>

            {loading && <div style={{ color: 'var(--text-muted)' }}>Loading saved questions...</div>}
            {error && <div className="alert-error">{error}</div>}

            {!loading && questions.length === 0 && (
                <div className="dashboard-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No saved questions yet. Click "Save Question" during test analysis to bookmark items here.
                </div>
            )}

            <div className="saved-list">
                {questions.map((q, idx) => (
                    <div key={q._id || idx} className="saved-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Bookmark size={16} color="var(--primary)" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>Saved Question #{questions.length - idx}</span>
                        </div>

                        <div className="q-title">{renderSafeVal(q.questionText)}</div>

                        {q.options && q.options.length > 0 && (
                            <div style={{ margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Options</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} style={{
                                            background: 'rgba(15, 23, 42, 0.5)',
                                            border: '1px solid var(--border-color)',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.85rem',
                                            color: 'var(--text-muted)'
                                        }}>
                                            {renderSafeVal(opt)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="answer-tag">
                            <CheckCircle size={14} /> Correct Answer: {renderSafeVal(q.correctOption)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedQuestions;
