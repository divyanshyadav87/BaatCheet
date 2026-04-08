"use client";

export default function DashboardHome() {
  const stats = [
    { label: 'Social Score', value: '78', icon: '📊', color: '#8b5cf6', change: '+5 this week' },
    { label: 'Chats Analyzed', value: '24', icon: '💬', color: '#10b981', change: '+3 today' },
    { label: 'AI Suggestions', value: '156', icon: '✨', color: '#ec4899', change: '' },
    { label: 'Daily Streak', value: '7 🔥', icon: '🔥', color: '#f59e0b', change: '' },
  ];

  const recentActivity = [
    { name: 'Priya', platform: 'WhatsApp', score: '82%', time: '2h ago', message: 'Hey! How was your weekend?' },
    { name: 'Arjun', platform: 'Instagram', score: '75%', time: '5h ago', message: 'That reel was amazing 😂' },
    { name: 'Sneha', platform: 'Telegram', score: '91%', time: '1d ago', message: 'Are you free for coffee?' },
  ];

  const tips = [
    { icon: '💡', text: 'Ask open-ended questions to keep conversations flowing naturally.' },
    { icon: '💡', text: 'Mirror their energy — if they use emojis, use them too!' },
    { icon: '💡', text: 'Don\'t double-text within 5 minutes. Give them space to respond.' },
  ];

  return (
    <div>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Good evening, <span className="gradient-text">User</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here's your social performance overview</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '24px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{s.icon}</div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>{s.change}</span>
             </div>
             <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.2rem' }}>{s.value}</div>
             <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Activity */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem' }}>Recent Activity</h2>
            <button style={{ color: 'var(--accent-purple)', fontWeight: '600', fontSize: '0.9rem' }}>View all</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {recentActivity.map((activity, i) => (
              <div key={i} className="glass" style={{ padding: '1.2rem 1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{activity.name[0]}</div>
                   <div>
                     <div style={{ fontWeight: '600' }}>{activity.name} · <span style={{ fontWeight: '400', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{activity.platform}</span></div>
                     <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{activity.message}</div>
                   </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', color: activity.score.replace('%','') > 80 ? '#10b981' : '#f59e0b' }}>{activity.score}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="glass" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            Upload New Chat →
          </button>
        </section>

        {/* Daily Tips */}
        <section>
           <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Daily AI Tips</h2>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {tips.map((tip, i) => (
               <div key={i} className="glass" style={{ padding: '1.2rem', borderRadius: '20px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                 <div style={{ color: 'var(--accent-purple)', fontSize: '1.2rem' }}>{tip.icon}</div>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{tip.text}</p>
               </div>
             ))}
           </div>
        </section>
      </div>
    </div>
  );
}
