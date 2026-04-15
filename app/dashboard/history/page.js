"use client";
import { useState, useEffect } from 'react';

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('baatcheet_history') || '[]');
      setHistory(stored);
    } catch (err) {
      console.error("Error reading history:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getToolIcon = (type) => {
    switch (type) {
      case 'reply': return '💬';
      case 'starter': return '🚀';
      case 'awkward': return '😅';
      default: return '✨';
    }
  };

  const getToolName = (type) => {
    switch (type) {
      case 'reply': return 'Reply Suggestion';
      case 'starter': return 'Convo Starter';
      case 'awkward': return 'Situational Advice';
      default: return 'AI Analysis';
    }
  };

  const filteredHistory = history.filter(item => 
    getToolName(item.type).toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.tone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.context || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('baatcheet_history', JSON.stringify(updated));
  };

  return (
    <div>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Your <span className="gradient-text">Activity</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {isLoading ? 'Loading your analyses...' : `${history.length} analyse${history.length !== 1 ? 's' : ''} completed`}
        </p>
      </header>

      <div className="glass" style={{ 
        padding: '0.8rem 1.5rem', 
        borderRadius: '16px', 
        marginBottom: '2rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        width: '100%'
      }}>
        <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>🔍</span>
        <input 
          type="text" 
          placeholder="Search by tool, tone, or context..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ background: 'none', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '1rem' }}
        />
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
           <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-purple)', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }}></div>
           <p style={{ color: 'var(--text-secondary)' }}>Bringing back your brilliance...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredHistory.length === 0 ? (
            <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '24px' }}>
               <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📭</div>
               <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>No history yet</h3>
               <p style={{ color: 'var(--text-secondary)' }}>Start analyzing chats to see your history here.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.id} className="glass" style={{ padding: '1.2rem 2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'transform 0.2s' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', overflow: 'hidden', flex: 1 }}>
                    <div style={{ minWidth: '48px', width: '48px', height: '48px', borderRadius: '16px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      {getToolIcon(item.type)}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                       <div style={{ fontSize: '1.1rem', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                         {getToolName(item.type)}
                       </div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                          <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>✨ {item.tone || 'Smart'}</span>
                          <span>📅 {new Date(item.created_at).toLocaleDateString()}</span>
                       </div>
                       <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                         {item.context && item.context.length > 60 ? item.context.substring(0, 60) + '...' : item.context || 'N/A'}
                       </div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 'bold', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      DONE
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.3rem', transition: 'color 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                      title="Delete"
                    >
                      🗑️
                    </button>
                 </div>
              </div>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
