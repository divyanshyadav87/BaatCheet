"use client";
import { useState, useEffect } from 'react';

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const email = localStorage.getItem('baatcheet_user_email');
        if (!email) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`/api/history?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        if (res.ok && data.history) {
          setHistory(data.history);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
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
           <p style={{ color: 'var(--text-secondary)' }}>Loading your history...</p>
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
            filteredHistory.map((item) => {
              const isExpanded = expandedId === item.id;
              let parsedResult = null;
              try {
                parsedResult = JSON.parse(item.result);
              } catch(e) {
                // Ignore parse error
              }

              return (
              <div 
                key={item.id} 
                className="glass" 
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                style={{ 
                  padding: '1.2rem 2rem', 
                  borderRadius: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: isExpanded ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)'
                }}
              >
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                         {!isExpanded && (
                           <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                             {item.context && item.context.length > 60 ? item.context.substring(0, 60) + '...' : item.context || 'N/A'}
                           </div>
                         )}
                      </div>
                   </div>
                   <div className="glass" style={{ padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 'bold', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                     {isExpanded ? 'LESS' : 'VIEW'}
                   </div>
                 </div>

                 {isExpanded && (
                   <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                     <div style={{ marginBottom: '1.5rem' }}>
                       <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-purple)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Original Chat / Context</h4>
                       <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                         {item.context || 'No explicit context provided.'}
                       </div>
                     </div>
                     
                     <div>
                       <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-purple)', marginBottom: '0.5rem', fontWeight: 'bold' }}>AI Suggestions</h4>
                       <div style={{ display: 'grid', gap: '0.8rem' }}>
                         {parsedResult && parsedResult.suggestions ? (
                           parsedResult.suggestions.map((sug, i) => (
                             <div key={i} style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)', fontSize: '0.95rem' }}>
                               {sug.text || sug}
                             </div>
                           ))
                         ) : (
                           <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', fontSize: '0.95rem' }}>
                             {item.result}
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 )}
              </div>
            )})
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
