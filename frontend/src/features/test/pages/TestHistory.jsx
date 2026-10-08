import React, { useState, useEffect } from 'react';
import { getTestHistory } from '../services/test.api';
import { Award } from 'lucide-react';
import FormattedFeedback from '../components/FormattedFeedback';

const TestHistory = () => {
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getTestHistory();
                setHistoryList(data.history || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch test history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div>
            <div className="page-title-block">
                <h1>Test History</h1>
                <p>View your past test scores and AI feedback evaluations.</p>
            </div>

            {loading && <div style={{ color: 'var(--text-muted)' }}>Loading history...</div>}
            {error && <div className="alert-error">{error}</div>}

            {!loading && historyList.length === 0 && (
                <div className="dashboard-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No test history records found yet. Take a mock test to view feedback here!
                </div>
            )}

            <div className="history-list">
                {historyList.map((item, idx) => (
                    <div key={item._id || idx} className="history-card">
                        <div className="history-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={20} color="var(--primary)" />
                                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Attempt #{historyList.length - idx}</span>
                            </div>

                            <div className="score-badge">
                                Score: {item.score}
                            </div>
                        </div>

                        <FormattedFeedback feedback={item.llmFeedback} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestHistory;
