import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Converts **bold** markers in a string to <strong> React elements.
 */
const parseBold = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} style={{ color: 'var(--text-main)', fontWeight: 700 }}>{part}</strong> : part
    );
};

/**
 * Renders markdown-like LLM feedback into clean HTML elements.
 * Handles: headings (#), bold (**), bullet lists (-, *), numbered lists, separators (--, ---)
 */
const FeedbackBody = ({ feedback }) => {
    if (!feedback) return null;

    const lines = feedback.split('\n');
    const elements = [];
    let currentList = [];
    let listType = 'ul';

    const flushList = (keyPrefix) => {
        if (currentList.length === 0) return;
        const Tag = listType;
        elements.push(
            <Tag key={`${keyPrefix}-list`} style={{ paddingLeft: '1.4rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                {currentList.map((item, i) => (
                    <li key={i} style={{ marginBottom: '0.35rem', lineHeight: 1.6 }}>{parseBold(item)}</li>
                ))}
            </Tag>
        );
        currentList = [];
        listType = 'ul';
    };

    lines.forEach((line, idx) => {
        const trimmed = line.trim();

        // Skip empty lines
        if (!trimmed) {
            flushList(idx);
            return;
        }

        // Skip raw separator lines (-- or --- or **--**)
        if (/^[-*]{2,}$/.test(trimmed)) {
            flushList(idx);
            elements.push(<hr key={idx} style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.75rem 0' }} />);
            return;
        }

        // Headings: ### ## #
        if (/^#{1,3}\s/.test(trimmed)) {
            flushList(idx);
            const title = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
            elements.push(
                <h4 key={idx} style={{
                    color: '#a5b4fc',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginTop: '1rem',
                    marginBottom: '0.4rem',
                }}>
                    {title}
                </h4>
            );
            return;
        }

        // Bold-only lines acting as headings (e.g. **Question 4 (Profit & Loss)**)
        if (/^\*\*[^*]+\*\*$/.test(trimmed)) {
            flushList(idx);
            const title = trimmed.replace(/\*\*/g, '');
            elements.push(
                <h5 key={idx} style={{
                    color: '#c4b5fd',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    marginTop: '0.85rem',
                    marginBottom: '0.3rem',
                }}>
                    {title}
                </h5>
            );
            return;
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
            if (listType !== 'ol') { flushList(idx); listType = 'ol'; }
            const content = trimmed.replace(/^\d+\.\s*/, '');
            currentList.push(content);
            return;
        }

        // Bullet list (- or *)
        if (/^[-*]\s/.test(trimmed)) {
            if (listType !== 'ul') { flushList(idx); listType = 'ul'; }
            const content = trimmed.replace(/^[-*]\s*/, '');
            currentList.push(content);
            return;
        }

        // Regular paragraph
        flushList(idx);
        elements.push(
            <p key={idx} style={{ color: 'var(--text-muted)', marginBottom: '0.6rem', lineHeight: 1.65 }}>
                {parseBold(trimmed)}
            </p>
        );
    });

    flushList('final');
    return <div style={{ textAlign: 'left' }}>{elements}</div>;
};

/**
 * Accordion wrapper around FeedbackBody.
 * Collapsed by default. Click to expand/collapse.
 */
const FormattedFeedback = ({ feedback, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    if (!feedback) return null;

    return (
        <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderLeft: '4px solid var(--primary)',
            borderRadius: 'var(--radius-md)',
            marginTop: '1rem',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
        }}>
            {/* Accordion Header */}
            <button
                onClick={() => setOpen(prev => !prev)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.25rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#a5b4fc',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    gap: '0.5rem',
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={17} />
                    AI Feedback
                </span>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* Accordion Body */}
            {open && (
                <div style={{ padding: '0 1.25rem 1.25rem 1.25rem' }}>
                    <FeedbackBody feedback={feedback} />
                </div>
            )}
        </div>
    );
};

export default FormattedFeedback;
