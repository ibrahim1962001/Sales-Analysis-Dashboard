import React, { useState } from 'react';

interface SmartFilterProps {
  onSearch: (query: string) => void;
}

export const SmartFilter: React.FC<SmartFilterProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', width: '100%' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Sales > 500 or Filter by Cairo..."
          style={{
            width: '100%',
            padding: '12px 16px 12px 40px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--bg-color)',
            color: '#fff',
            fontSize: '14px'
          }}
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" height="18" viewBox="0 0 24 24" fill="none" 
          stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <button 
        type="submit" 
        style={{ 
          padding: '0 20px', 
          background: 'var(--primary)', 
          color: '#000', 
          border: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Ask Data
      </button>
    </form>
  );
};
