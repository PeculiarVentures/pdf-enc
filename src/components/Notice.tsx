import React from 'react';
import './Notice.css';

type NoticeType = 'info' | 'warning' | 'error' | 'confirm';

interface NoticeAction {
  label: string;
  variant?: 'primary' | 'default' | 'danger';
  onClick: () => void;
}

interface NoticeProps {
  type?: NoticeType;
  title?: string;
  message: React.ReactNode;
  actions?: NoticeAction[];
}

export default function Notice({ type = 'info', title, message, actions = [] }: NoticeProps) {
  return (
    <div className={`notice notice-${type}`} role="alert">
      <div className="notice-body">
        {title && <div className="notice-title">{title}</div>}
        <div className="notice-message">{message}</div>
      </div>

      {actions.length > 0 && (
        <div className="notice-actions">
          {actions.map((a, i) => (
            <button
              key={i}
              className={`notice-btn notice-btn-${a.variant ?? 'default'}`}
              onClick={a.onClick}
              type="button"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
