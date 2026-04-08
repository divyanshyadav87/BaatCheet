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
    <aside className="glass" style={{ 
      width: '280px', 
      height: '100vh', 
      position: 'fixed', 
      left: 0, 
      top: 0, 
      borderRight: '1px solid var(--card-border)',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1rem' }}>✨</span>
        </div>
        <span className="gradient-text" style={{ fontWeight: '800', fontSize: '1.4rem' }}>BaatCheet</span>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.2rem',
                borderRadius: '16px',
                marginBottom: '0.5rem',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => { if(!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)' }}
              onMouseOut={(e) => { if(!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link href="/logout" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.2rem',
        borderRadius: '16px',
        color: 'var(--text-secondary)',
        fontWeight: '500',
        transition: 'all 0.2s',
      }}>
        <span style={{ fontSize: '1.2rem' }}>🚪</span> Log out
      </Link>
    </aside>
  );
}
