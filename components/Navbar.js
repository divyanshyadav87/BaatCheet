"use client";
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '1200px',
      borderRadius: '20px',
      padding: '0.8rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)' }}>
          <span style={{ fontSize: '1.2rem', color: '#fff' }}>✨</span>
        </div>
        <span className="gradient-text" style={{ letterSpacing: '-0.02em', fontSize: '1.4rem', fontWeight: '800' }}>BaatCheet</span>
      </div>

      <div style={{ display: 'flex', gap: '2.5rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.95rem' }}>
        <Link href="#features" style={{ transition: 'color 0.2s' }}>Features</Link>
        <Link href="#testimonials" style={{ transition: 'color 0.2s' }}>Testimonials</Link>
        <Link href="#pricing" style={{ transition: 'color 0.2s' }}>Pricing</Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link href="/login" style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>Log in</Link>
        <Link href="/signup" style={{
          background: 'var(--gradient-primary)',
          padding: '0.6rem 1.4rem',
          borderRadius: '12px',
          color: '#fff',
          fontWeight: '600',
          fontSize: '0.9rem',
          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
        }}>Sign up</Link>
      </div>
    </nav>
  );
}
