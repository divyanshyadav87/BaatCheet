"use client";

export default function ProfilePage() {
  const profileSettings = [
    { label: 'Account Settings', icon: '⚙️', sub: 'Manage your account details' },
    { label: 'Notifications', icon: '🔔', sub: 'Configure notification preferences' },
    { label: 'Privacy & Security', icon: '🛡️', sub: 'Manage your data and security' },
    { label: 'Subscription', icon: '👑', sub: 'Pro Plan · Renews Jan 15, 2025' },
  ];

  return (
    <div style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Your <span className="gradient-text">Profile</span></h1>
      </header>

      {/* Profile Header */}
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>U</div>
            <div>
               <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.4rem' }}>User Name</h2>
               <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>📧 user@email.com</div>
               <div className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  👑 Pro Plan
               </div>
            </div>
         </div>
         <button className="glass" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: '600' }}>Edit Profile</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {profileSettings.map((item, i) => (
          <div key={i} className="glass" style={{ padding: '1.5rem 2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{item.icon}</div>
               <div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{item.label}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.sub}</div>
               </div>
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}
