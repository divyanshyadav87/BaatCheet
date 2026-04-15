"use client";
import { useState, useRef } from 'react';

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState('reply'); 
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [encodedFile, setEncodedFile] = useState(null);
  const [selectedTone, setSelectedTone] = useState('Smart');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toolTones = {
    reply: [
      { label: 'Flirty', emoji: '🔥' },
      { label: 'Smart', emoji: '🧠' },
      { label: 'Funny', emoji: '😂' },
      { label: 'Mysterious', emoji: '💙' },
      { label: 'Classy', emoji: '💎' },
    ],
    starter: [
      { label: 'Creative', emoji: '🎨' },
      { label: 'Deep', emoji: '🌊' },
      { label: 'Cheesy', emoji: '🧀' },
      { label: 'Direct', emoji: '🎯' },
      { label: 'Friendly', emoji: '👋' },
    ],
    awkward: [
      { label: 'Honest', emoji: '✨' },
      { label: 'Funny', emoji: '😂' },
      { label: 'Diplomatic', emoji: '🤝' },
      { label: 'Apologetic', emoji: '🙏' },
      { label: 'Professional', emoji: '💼' },
    ]
  };

  const tabs = [
    { id: 'reply', label: 'Reply Suggestions', icon: '💬', tagline: 'Upload a chat screenshot or type the exact conversation.' },
    { id: 'starter', label: 'Convo Starters', icon: '🚀', tagline: 'Upload a photo of them/their activity or describe their bio.' },
    { id: 'awkward', label: 'Awkward Situations', icon: '😅', tagline: 'Describe the tricky situation in detail to get expert advice.' },
  ];

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File is too large. Max 5MB allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Extract base64 part
      const base64String = reader.result.split(',')[1];
      setEncodedFile({
        base64: base64String,
        mimeType: selectedFile.type
      });
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const clearFile = (e) => {
    if (e) e.stopPropagation();
    setEncodedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleProcess = async () => {
    if (!inputText && !encodedFile) return;
    setIsLoading(true);
    setResult(null);
    
    try {
      // In a production scenario with file uploads, you would use FormData.
      // For this unified tool, we will send everything as JSON for now (if text).
      // A dedicated server action or API route handles the actual Gemini request.
      
      const payload = {
        type: activeTab,
        context: inputText,
        image: encodedFile,
        tone: selectedTone
      };

      const response = await fetch('/api/unified-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        
        // Save to localStorage history
        try {
          const historyEntry = {
            id: Date.now().toString(),
            type: activeTab,
            context: inputText || 'Image uploaded',
            result: JSON.stringify(data),
            tone: selectedTone,
            created_at: new Date().toISOString()
          };
          const existing = JSON.parse(localStorage.getItem('baatcheet_history') || '[]');
          existing.unshift(historyEntry);
          localStorage.setItem('baatcheet_history', JSON.stringify(existing));
        } catch (storageErr) {
          console.warn("Could not save to history:", storageErr);
        }
      } else {
        setResult({ error: data.error || 'Something went wrong.' });
      }
    } catch (e) {
      console.error(e);
      setResult({ error: 'Network error or server unavailable.' });
    } finally {
      setIsLoading(false);
    }
  };

  const currentTabInfo = tabs.find(t => t.id === activeTab);

  return (
    <div>
      <style>{`
        .tab-button {
          padding: 1rem 1.5rem;
          border-radius: 16px;
          border: 1px solid transparent;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-secondary);
        }
        .tab-button.active {
          background: rgba(139, 92, 246, 0.15);
          color: #fff;
          border-color: rgba(139, 92, 246, 0.3);
        }
        .tab-button:hover:not(.active) {
          background: rgba(255, 255, 255, 0.08);
        }
        .action-area {
          margin-top: 2rem;
          display: grid;
          gap: 2rem;
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .action-area {
            grid-template-columns: 1fr 1fr;
          }
          .action-area.single-col {
            grid-template-columns: 1fr;
            max-width: 800px;
            margin: 2rem auto;
          }
        }
        textarea.glass-input {
          width: 100%;
          min-height: 150px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          padding: 1.5rem;
          border-radius: 20px;
          color: #fff;
          outline: none;
          font-family: inherit;
          font-size: 1rem;
          resize: vertical;
        }
        textarea.glass-input:focus {
          border-color: var(--accent-purple);
        }
        .file-drop {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.02);
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 20px;
          min-height: 150px;
          cursor: pointer;
          transition: all 0.3s;
          color: var(--text-secondary);
        }
        .file-drop:hover {
          border-color: var(--accent-purple);
          background: rgba(139, 92, 246, 0.05);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.4s ease forwards;
        }
      `}</style>
      
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Your <span className="gradient-text">AI Arsenal</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Select a tool to enhance your social interactions.</p>
      </header>

      {/* Tab Selectors */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { 
                setActiveTab(tab.id); 
                setResult(null); 
                setInputText(''); 
                clearFile();
                // Set default tone based on tab
                if (tab.id === 'reply') setSelectedTone('Smart');
                else if (tab.id === 'starter') setSelectedTone('Creative');
                else if (tab.id === 'awkward') setSelectedTone('Diplomatic');
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass fade-in" style={{ padding: '2rem', borderRadius: '32px', border: '1px solid var(--accent-purple)', boxShadow: '0 10px 40px rgba(139, 92, 246, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.8rem' }}>{currentTabInfo.icon} {currentTabInfo.label}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{currentTabInfo.tagline}</p>
        </div>

        <div className={`action-area ${activeTab === 'awkward' ? 'single-col' : ''}`}>
          {/* File Upload (Hidden for Awkward Situations) */}
          {activeTab !== 'awkward' && (
            <div 
              className="file-drop" 
              onClick={() => fileInputRef.current?.click()}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              
              {imagePreview ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <button 
                    onClick={clearFile}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(239, 44, 44, 0.8)',
                      border: 'none',
                      color: '#fff',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      zIndex: 2
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>📤</div>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Click or drag file here</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Supports JPG, PNG (Max 5MB)</div>
                </>
              )}
            </div>
          )}

          {/* Text Input */}
          <textarea 
            className="glass-input" 
            placeholder={
              activeTab === 'reply' ? '...Or type the last few messages here:\nThem: Hey what are you up to?\nYou: Nothing much just chillin\nThem: Cool, I am so bored rn' :
              activeTab === 'starter' ? '...Or describe their bio/interests:\n"Loves hiking, coffee, and golden retrievers. Just moved to the city."' :
              'Describe the exact situation here. For example:\n"I accidentally texted my manager something meant for my friend about how annoying the meeting was. What do I say to fix this without looking bad?"'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Tone Selector */}
        <div style={{ marginTop: '2.5rem' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block', textAlign: 'center' }}>
            Select Response Style
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center', marginBottom: '2rem' }}>
            {toolTones[activeTab]?.map((t) => (
              <button 
                key={t.label}
                onClick={() => setSelectedTone(t.label)}
                style={{ 
                  padding: '0.6rem 1.4rem', 
                  borderRadius: '100px', 
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s',
                  backgroundColor: selectedTone === t.label ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: selectedTone === t.label ? '1px solid var(--accent-purple)' : '1px solid transparent',
                  color: selectedTone === t.label ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer'
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
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button 
            className="gradient-bg" 
            disabled={(!inputText && !encodedFile) || isLoading}
            onClick={handleProcess}
            style={{ 
              padding: '1.2rem 3rem', 
              borderRadius: '16px', 
              color: '#fff', 
              fontWeight: '700', 
              fontSize: '1.1rem',
              border: 'none',
              cursor: (!inputText && !encodedFile) || isLoading ? 'not-allowed' : 'pointer',
              opacity: (!inputText && !encodedFile) || isLoading ? 0.6 : 1,
              boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.3s'
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span className="spinner" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                Processing...
              </span>
            ) : 'Analyze with AI ✨'}
          </button>
          <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
            7 USES LEFT TODAY
          </p>
        </div>
      </div>

      {/* Results Box */}
      {result && (
        <div className="glass fade-in" style={{ marginTop: '3rem', padding: '3rem', borderRadius: '32px', background: 'rgba(139, 92, 246, 0.08)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ color: 'var(--accent-purple)' }}>✨</span> AI Output
          </h3>
          
          {result.error ? (
            <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '16px' }}>
              Error: {result.error}
            </div>
          ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {result.suggestions && Object.values(result.suggestions).map((res, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', position: 'relative', transition: 'all 0.3s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        Option {idx + 1}
                        <span style={{ 
                          fontSize: '0.65rem', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '100px', 
                          background: idx < 2 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                          color: idx < 2 ? '#60a5fa' : '#fb923c',
                          border: `1px solid ${idx < 2 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`
                        }}>
                          {idx < 2 ? '🇬🇧 English' : '🇮🇳 Hinglish'}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleCopy(res.text || res, idx)}
                        style={{ 
                          background: 'rgba(255,255,255,0.05)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          color: copiedId === idx ? '#10b981' : 'var(--text-secondary)', 
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          cursor: 'pointer', 
                          fontSize: '0.75rem', 
                          fontWeight: '600',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.4rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        {copiedId === idx ? '✓ Copied' : '📋 Copy'}
                      </button>
                    </div>
                    <div style={{ fontSize: '1.1rem', color: '#fff', lineHeight: '1.5', paddingRight: '1rem' }}>
                      "{res.text || res}"
                    </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
