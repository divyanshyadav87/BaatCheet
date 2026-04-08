"use client";
import { useState } from 'react';
import Navbar from "@/components/Navbar";

export default function DemoPage() {
  const [tone, setTone] = useState('Flirty');
  const [text, setText] = useState('');

  const tones = [
    { label: 'Flirty', emoji: '🔥' },
    { label: 'Smart', emoji: '🧠' },
    { label: 'Funny', emoji: '😂' },
    { label: 'Mysterious', emoji: '💙' },
    { label: 'Classy', emoji: '💎' },
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#050508' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '10rem', paddingBottom: '5rem', display: 'flex', justifyContent: 'center' }}>
        <div className="glass" style={{ width: '100%', maxWidth: '600px', borderRadius: '32px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                <span className="gradient-text" style={{ fontSize: '1.2rem' }}>BaatCheet ✨</span>
             </div>
             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', cursor: 'pointer' }}>🕒</span>
                <div className="glass" style={{ padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  7/7 <span style={{ color: '#fbbf24' }}>⚡</span>
                </div>
             </div>
          </div>

          <div style={{ padding: '2rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>
              Add Screenshot (Optional)
            </label>
            
            {/* Upload Zone */}
            <div style={{ 
              height: '200px', 
              border: '2px dashed var(--card-border)', 
              borderRadius: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              marginBottom: '2rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-purple)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}>
              <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🖼️</span>
              <span style={{ fontWeight: '500' }}>Tap to add photo</span>
            </div>

            {/* Input Area */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', marginBottom: '1rem' }}>
              <textarea 
                placeholder="Paste chat, bio, ya situation… baaki main dekh lunga 😎"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'none', 
                  border: 'none', 
                  color: '#fff', 
                  fontSize: '1rem', 
                  fontFamily: 'inherit',
                  outline: 'none',
                  minHeight: '120px',
                  resize: 'none'
                }}
              />
            </div>

            <p style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              💡 Screenshot ya message daalo — replies ready in seconds
            </p>

            {/* Tone Selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '2.5rem' }}>
              {tones.map((t) => (
                <button 
                  key={t.label}
                  onClick={() => setTone(t.label)}
                  style={{ 
                    padding: '0.6rem 1.4rem', 
                    borderRadius: '100px', 
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s',
                    backgroundColor: tone === t.label ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: tone === t.label ? '1px solid var(--accent-purple)' : '1px solid transparent',
                    color: tone === t.label ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
              <div style={{ 
                padding: '0.6rem 1.4rem', 
                borderRadius: '100px', 
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                cursor: 'not-allowed'
              }}>
                PRO styles coming 🔒
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.05em' }}>
                ⚡ WANT UNLIMITED REPLIES? <span className="gradient-text" style={{ cursor: 'pointer' }}>JOIN PRO WAITLIST →</span>
              </span>
            </div>

            <button className="gradient-bg" style={{ 
              width: '100%', 
              padding: '1.2rem', 
              borderRadius: '24px', 
              color: '#fff', 
              fontWeight: '800', 
              fontSize: '1.2rem',
              letterSpacing: '0.05em',
              boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem'
            }}>
              GET REPLIES ⚡
            </button>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
              7 USES LEFT TODAY
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
