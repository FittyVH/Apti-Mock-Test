import React, { useState, useEffect } from 'react';
import { submitTest } from '../services/test.api';
import { Clock, ArrowLeft, ArrowRight, Send } from 'lucide-react';

const LiveTest = ({ testData, onTestFinished }) => {
    const { testId, timeLimitMinutes, questions = [] } = testData;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeftSeconds, setTimeLeftSeconds] = useState((timeLimitMinutes || 15) * 60);
    const [submitting, setSubmitting] = useState(false);

    const currentQ = questions[currentIndex] || {};

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeftSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (optionValue) => {
        setUserAnswers((prev) => ({
            ...prev,
            [currentQ.id]: optionValue
        }));
    };

    const handleSubmitTest = async () => {
        if (submitting) return;
        setSubmitting(true);
        const totalTimeAllowed = (timeLimitMinutes || 15) * 60;
        const timeTakenSeconds = Math.max(0, totalTimeAllowed - timeLeftSeconds);

        try {
            const result = await submitTest({
                testId,
                userAnswers,
                timeTakenSeconds
            });
            onTestFinished(result);
        } catch (err) {
            alert(err.message || 'Error submitting test');
            setSubmitting(false);
        }
    };

    if (!currentQ || questions.length === 0) {
        return <div style={{ color: 'var(--text-muted)' }}>No questions available.</div>;
    }

    const selectedOption = userAnswers[currentQ.id];

    return (
        <div className="test-screen">
            <div className="test-header">
                <div>
                    <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>Live Mock Test</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Question {currentIndex + 1} of {questions.length}
                    </p>
                </div>

                <div className="timer-badge">
                    <Clock size={18} />
                    <span>{formatTime(timeLeftSeconds)}</span>
                </div>
            </div>

            <div className="question-box">
                <div style={{ marginBottom: '0.75rem' }}>
                    <span className="q-number">Question {currentIndex + 1}</span>
                </div>

                <h3 className="q-text">{typeof currentQ.questionText === 'object' ? JSON.stringify(currentQ.questionText) : currentQ.questionText}</h3>

                <div className="options-list">
                    {currentQ.options && currentQ.options.map((opt, idx) => {
                        const displayText = typeof opt === 'object' && opt !== null ? (opt.text ? `${opt.key ? opt.key + ': ' : ''}${opt.text}` : (opt.text || opt.value || JSON.stringify(opt))) : String(opt);
                        const optValue = typeof opt === 'object' && opt !== null ? (opt.text || opt.key || String(opt)) : String(opt);
                        const optLabel = typeof opt === 'object' && opt !== null && opt.key ? opt.key : String.fromCharCode(65 + idx);
                        const isSelected = selectedOption === optValue || selectedOption === opt;

                        return (
                            <div
                                key={idx}
                                className={`option-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(optValue)}
                            >
                                <div className="opt-indicator">{optLabel}</div>
                                <div style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{displayText}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="test-footer-nav">
                <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="btn-secondary"
                    style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
                >
                    <ArrowLeft size={16} /> Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                        className="btn-primary"
                    >
                        Next <ArrowRight size={16} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmitTest}
                        className="btn-primary"
                        disabled={submitting}
                        style={{ background: 'var(--success)' }}
                    >
                        <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Test'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default LiveTest;
