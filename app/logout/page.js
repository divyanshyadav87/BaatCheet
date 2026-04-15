"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear user session from localStorage
    localStorage.removeItem('baatcheet_user_email');
    localStorage.removeItem('baatcheet_logged_in');

    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050508' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '400px', borderRadius: '32px', padding: '3.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>👋</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>Successfully <span className="gradient-text">Logged Out</span></h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6' }}>We're sad to see you go. You'll be redirected to the home page in a few seconds.</p>
        
        <Link href="/" style={{
          display: 'block',
          width: '100%',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--card-border)',
          padding: '1rem',
          borderRadius: '12px',
          color: '#fff',
          fontWeight: '700',
          transition: 'background 0.2s'
        }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}>
          Go back home now
        </Link>
      </div>
    </main>
  );
}
