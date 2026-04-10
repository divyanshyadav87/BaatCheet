import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: '🏠', href: '/dashboard' },
    { label: 'Upload Chat', icon: '📤', href: '/dashboard/upload' },
    { label: 'History', icon: '🕒', href: '/dashboard/history' },
    { label: 'Profile', icon: '👤', href: '/dashboard/profile' },
  ];

  return (
    <>
      <style>{`
        .sidebar { width: 280px; height: 100vh; position: fixed; left: 0; top: 0; border-right: 1px solid var(--card-border); padding: 2rem 1.5rem; display: flex; flex-direction: column; z-index: 100; }
        .sidebar-brand { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 3rem; padding: 0 0.5rem; }
        .sidebar-nav { flex: 1; }
        .sidebar-link { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.2rem; border-radius: 16px; margin-bottom: 0.5rem; transition: all 0.2s; }
        .sidebar-logout { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.2rem; border-radius: 16px; transition: all 0.2s; color: var(--text-secondary); font-weight: 500; }
        .nav-label { display: block; }
        .nav-icon { font-size: 1.2rem; }

        @media (max-width: 900px) {
          .sidebar { width: 100%; height: 75px; top: auto; bottom: 0; border-right: none; border-top: 1px solid var(--card-border); padding: 0.5rem 1rem; flex-direction: row; justify-content: space-around; align-items: center; background: rgba(13,13,18,0.95); backdrop-filter: blur(20px); }
          .sidebar-brand { display: none; }
          .sidebar-nav { display: flex; width: 100%; justify-content: space-around; align-items: center; }
          .sidebar-link { flex-direction: column; gap: 0.3rem; padding: 0.5rem 1rem; margin-bottom: 0; border-radius: 12px; }
          .nav-label { font-size: 0.65rem; }
          .nav-icon { font-size: 1.3rem; }
          .sidebar-logout { display: none; }
        }
      `}</style>
      <aside className="glass sidebar">
        <div className="sidebar-brand">
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1rem' }}>✨</span>
          </div>
          <span className="gradient-text" style={{ fontWeight: '800', fontSize: '1.4rem' }}>BaatCheet</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="sidebar-link"
                style={{
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                }}
                onMouseOver={(e) => { if(!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)' }}
                onMouseOut={(e) => { if(!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link href="/logout" className="sidebar-logout" onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <span style={{ fontSize: '1.2rem' }}>🚪</span> Log out
        </Link>
      </aside>
    </>
  );
}
