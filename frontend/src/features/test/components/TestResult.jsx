import React, { useState } from 'react';
import { saveQuestion } from '../services/test.api';
import { Award, CheckCircle, XCircle, ArrowLeft, Bookmark } from 'lucide-react';
import FormattedFeedback from './FormattedFeedback';


const TestResult = ({ result, onReset }) => {
    const { score = 0, totalQuestions = 0, reviewData = [], llmFeedback = '' } = result;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const [savedMap, setSavedMap] = useState({});

    const renderSafeVal = (val) => {
        if (val === null || val === undefined) return 'Not Answered';
        if (typeof val === 'string' || typeof val === 'number') return String(val);
        if (typeof val === 'object') {
            return val.text ? `${val.key ? val.key + ': ' : ''}${val.text}` : (val.text || val.value || val.key || JSON.stringify(val));
        }
        return String(val);
    };

    const handleSave = async (item, idx) => {
        try {
            const qText = renderSafeVal(item.questionText);
            const cOpt = renderSafeVal(item.correctOption);
            const rawOpts = (item.options || []).map(opt => renderSafeVal(opt));
            
            await saveQuestion({
                questionText: qText,
                options: rawOpts,
                correctOption: cOpt
            });
            setSavedMap(prev => ({ ...prev, [idx]: true }));
        } catch (err) {
            alert('Failed to save question');
        }
    };

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem',
                textAlign: 'center',
                marginBottom: '2rem'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 64,
                    height: 64,
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    borderRadius: '50%',
                    marginBottom: '1rem'
                }}>
                    <Award size={32} />
                </div>

                <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    Test Completed!
                </h1>

                <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    margin: '1rem 0'
                }}>
                    {score} / {totalQuestions} <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>({percentage}%)</span>
                </div>

                {llmFeedback && (
                    <FormattedFeedback feedback={llmFeedback} defaultOpen={true} />
                )}
            </div>

            {reviewData.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Question Analysis & Review</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {reviewData.map((item, idx) => {
                            const isSaved = savedMap[idx];
                            return (
                                <div key={idx} style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '1.5rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>Question {idx + 1}</span>
                                            {item.isCorrect ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                                                    <CheckCircle size={16} /> Correct
                                                </span>
                                            ) : (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--error)', fontSize: '0.85rem', fontWeight: 600 }}>
                                                    <XCircle size={16} /> Incorrect
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleSave(item, idx)}
                                            style={{
                                                background: isSaved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                                color: isSaved ? 'var(--success)' : 'var(--text-muted)',
                                                border: '1px solid var(--border-color)',
                                                padding: '0.4rem 0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.8rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem'
                                            }}
                                        >
                                            <Bookmark size={14} />
                                            {isSaved ? 'Saved' : 'Save Question'}
                                        </button>
                                    </div>

                                    <p style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.05rem' }}>
                                        {renderSafeVal(item.questionText)}
                                    </p>

                                    {item.options && item.options.length > 0 && (
                                        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Options</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                {item.options.map((opt, oIdx) => (
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

                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                                        <div><strong>Your Answer:</strong> {renderSafeVal(item.userSelected)}</div>
                                        <div style={{ color: 'var(--success)', marginTop: '0.25rem' }}><strong>Correct Answer:</strong> {renderSafeVal(item.correctOption)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div style={{ textAlign: 'center' }}>
                <button onClick={onReset} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                    <ArrowLeft size={18} /> Take Another Test
                </button>
            </div>
        </div>
    );
};

export default TestResult;
