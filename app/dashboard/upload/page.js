"use client";
import { useState, useRef } from 'react';
import { Sparkles, Heart, Moon, Copy } from 'lucide-react';

export default function UploadPage() {
  const [tone, setTone] = useState('Flirty');
  const [text, setText] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [finalSubmittedContent, setFinalSubmittedContent] = useState('');
  const fileInputRef = useRef(null);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'sparkles': return <Sparkles size={24} color="#f472b6" />;
      case 'heart': return <Heart size={24} color="#a78bfa" />;
      case 'moon': return <Moon size={24} color="#818cf8" />;
      default: return <Sparkles size={24} color="#f472b6" />;
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setExtractedText('');
      setImagePreview(null);
      setFileName('');

      if (file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file));
        setFileName(file.name);
        const Tesseract = await import('tesseract.js');
        const recognize = Tesseract.default?.recognize || Tesseract.recognize;
        const result = await recognize(file, 'eng');
        setExtractedText(result.data.text);
      } else if (file.name.endsWith('.txt') || file.type === 'text/plain') {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          setExtractedText(event.target.result);
        };
        reader.readAsText(file);
      } else {
        setError('Please upload an image (.jpg, .png) or text (.txt) file.');
      }
    } catch (err) {
      setError('Failed to process file: ' + err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleGetReplies = async () => {
    const finalContent = extractedText.trim() || text.trim();
    if (!finalContent) {
      setError("Please paste a chat, upload an image, or upload a .txt file first!");
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    setFinalSubmittedContent(finalContent);
    
    try {
      // 1. Upload chat text
      const chatPayload = {
        platform: 'whatsapp',
        contact_name: 'Crush',
        messages: [{ role: 'assistant', content: finalContent }]
      };
      
      const uploadRes = await fetch('/api/chat/upload-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatPayload)
      });
      
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload chat');
      
      // 2. Analyze chat
      const analyzePayload = {
        chat_id: uploadData.chatId,
        tone: tone.toLowerCase(),
        mockText: uploadData.mockText
      };
      
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyzePayload)
      });
      
      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(analyzeData.error || 'Failed to analyze chat');
      
      // If it returned an error object embedded in JSON result
      if (analyzeData.error) {
         throw new Error(analyzeData.error);
      }

      setResponse(analyzeData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tones = [
    { label: 'Flirty', emoji: '🔥' },
    { label: 'Smart', emoji: '🧠' },
    { label: 'Funny', emoji: '😂' },
    { label: 'Mysterious', emoji: '💙' },
    { label: 'Classy', emoji: '💎' },
  ];

  // Rendering logic
  if (response && response.options) {
    return (
      <div style={{ padding: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          The Enchanter's <span style={{ color: '#f472b6', fontStyle: 'italic', letterSpacing: '0.05em' }}>Whispers</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '800px', lineHeight: '1.6' }}>
          Three potent distillations synthesized from the celestial vibrations of your current connection. Choose the essence that matches your intended <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>Transmutation</span>.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)', gap: '2rem' }}>
          
          {/* Left Column - Source Scroll */}
          <div>
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px', position: 'sticky', top: '2rem' }}>
              <h3 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '800' }}>
                📜 SOURCE SCROLL
              </h3>
              
              <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#f472b6', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '0.8rem' }}>RECEIVED MESSAGE</p>
                <p style={{ fontStyle: 'italic', color: '#e2e8f0', fontSize: '1rem', lineHeight: '1.5' }}>
                  "{finalSubmittedContent}"
                </p>
              </div>

              <div style={{ display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '100px', background: 'rgba(167, 139, 250, 0.1)', color: '#a78bfa', fontSize: '0.75rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                ✨ CONTEXT ANALYSIS
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                {response.contextAnalysis}
              </p>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                <span style={{ padding: '0.4rem 1rem', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Social Hook</span>
                <span style={{ padding: '0.4rem 1rem', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>High Affinity</span>
                <span style={{ padding: '0.4rem 1rem', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Playful Defiance</span>
              </div>
            </div>
          </div>

          {/* Right Column - Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {response.options.map((opt, i) => (
              <div key={i} className="glass" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(244, 114, 182, 0.15)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.border = '1px solid rgba(244, 114, 182, 0.4)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.border = '1px solid rgba(244, 114, 182, 0.15)'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                    <div className="glass" style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}>
                      {getIcon(opt.icon)}
                    </div>
                    <h2 style={{ fontSize: '1.6rem', color: '#f472b6', fontWeight: 'bold' }}>{opt.name}</h2>
                  </div>
                  <button onClick={() => handleCopy(opt.quote)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                    <Copy size={16} /> Copy
                  </button>
                </div>
                
                <p style={{ fontSize: '1.25rem', color: '#fff', lineHeight: '1.6', marginBottom: '2rem', fontStyle: 'italic' }}>
                  "{opt.quote}"
                </p>
                
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: '800', letterSpacing: '0.1em' }}>🧪 ALCHEMICAL LOGIC</span>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {opt.logic}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="glass" style={{ padding: '1.5rem 2.5rem', borderRadius: '100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', background: 'linear-gradient(90deg, rgba(30,30,40,0.8) 0%, rgba(20,20,30,0.8) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ padding: '0.8rem', borderRadius: '50%', background: 'rgba(244,114,182,0.1)' }}>
              <Sparkles size={24} color="#f472b6" />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.2rem' }}>Not the right vibration?</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>Recalibrate the reagents for a different social outcome.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setResponse(null)} style={{ padding: '0.8rem 1.8rem', borderRadius: '100px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
              Adjust Tone
            </button>
            <button disabled={loading} onClick={handleGetReplies} style={{ padding: '0.8rem 1.8rem', borderRadius: '100px', background: 'linear-gradient(135deg, #c084fc 0%, #ec4899 100%)', border: 'none', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Recalibrating...' : 'Regenerate Spells'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
            accept="image/*,.txt"
          />
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
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            overflow: 'hidden',
            position: 'relative'
          }} 
          onClick={() => fileInputRef.current?.click()}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-purple)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}>
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Uploaded chat" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                  <span style={{ fontWeight: 'bold', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Tap to change</span>
                </div>
              </>
            ) : fileName ? (
              <>
                <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</span>
                <span style={{ fontWeight: '500' }}>{fileName}</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🖼️</span>
                <span style={{ fontWeight: '500' }}>Tap to add photo or .txt file</span>
              </>
            )}
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

          {error && (
            <div style={{ padding: '1rem', color: '#ff4d4f', backgroundColor: 'rgba(255,77,79,0.1)', borderRadius: '12px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <button 
            className="gradient-bg" 
            onClick={handleGetReplies}
            disabled={loading}
            style={{ 
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
            gap: '0.8rem',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
            border: 'none'
          }}>
            {loading ? 'ANALYZING... 🧠' : 'GET REPLIES ⚡'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
            7 USES LEFT TODAY
          </p>
        </div>
      </div>
    </div>
  );
}
