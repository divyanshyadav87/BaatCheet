"use client";
import { useState } from 'react';

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const history = [
    { name: 'Priya', platform: 'WhatsApp', count: 24, date: 'Dec 28, 2024', score: '82%', status: 'high' },
    { name: 'Arjun', platform: 'Instagram', count: 18, date: 'Dec 27, 2024', score: '75%', status: 'medium' },
    { name: 'Sneha', platform: 'Telegram', count: 32, date: 'Dec 26, 2024', score: '91%', status: 'high' },
    { name: 'Rahul', platform: 'WhatsApp', count: 15, date: 'Dec 25, 2024', score: '68%', status: 'low' },
    { name: 'Ananya', platform: 'Instagram', count: 27, date: 'Dec 24, 2024', score: '88%', status: 'high' },
  ];

  const filteredHistory = history.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Chat <span className="gradient-text">History</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>5 conversations analyzed</p>
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
          placeholder="Search conversations..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ background: 'none', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '1rem' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredHistory.map((item, i) => (
          <div key={i} className="glass" style={{ padding: '1.2rem 2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'transform 0.2s' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>{item.name[0]}</div>
                <div>
                   <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{item.name} · <span style={{ fontWeight: '400', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.platform}</span></div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.3rem' }}>
                      <span>💬 {item.count} messages</span>
                      <span>📅 {item.date}</span>
                   </div>
                </div>
             </div>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: item.score.replace('%','') > 80 ? '#10b981' : item.score.replace('%','') > 70 ? '#f59e0b' : '#ef4444' }}>{item.score}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>SCORE</div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
