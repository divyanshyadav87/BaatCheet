"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Store email in localStorage — no authentication needed
      localStorage.setItem('baatcheet_user_email', email);
      localStorage.setItem('baatcheet_logged_in', 'true');
      
      // Store in supabase asynchronously without blocking login
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'signup' })
      }).catch(console.error);
      
      // Short delay for UX smoothness
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050508' }}>
      <style>{`
        @media (max-width: 480px) {
          .auth-card { padding: 2rem 1.5rem !important; border-radius: 24px !important; width: 95% !important; }
          .auth-title { font-size: 1.6rem !important; }
        }
      `}</style>
      <div className="glass auth-card" style={{ width: '100%', maxWidth: '420px', borderRadius: '32px', padding: '3rem', textAlign: 'center' }}>
        
        {/* Logo */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1rem' }}>✨</span>
          </div>
          <span className="gradient-text" style={{ fontWeight: '800', fontSize: '1.4rem' }}>BaatCheet</span>
        </Link>
        
        <h1 className="auth-title" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Create Account</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Enter your email to start your premium social experience</p>
        
        {/* Form */}
        <form style={{ textAlign: 'left' }} onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.8rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>EMAIL ADDRESS</label>
            <input 
              required
              type="email" 
              placeholder="jack@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--card-border)', padding: '0.8rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none' }} 
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              background: isLoading ? 'rgba(139, 92, 246, 0.5)' : 'var(--gradient-primary)',
              padding: '1rem',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 20px rgba(139, 92, 246, 0.2)',
              marginBottom: '1.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>
        
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--accent-purple)', fontWeight: '600' }}>Log in</Link>
        </p>

        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </main>
  );
}
