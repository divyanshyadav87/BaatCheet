"use client";
import { useState } from 'react';

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState('reply'); 
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const tabs = [
    { id: 'reply', label: 'Reply Suggestions', icon: '💬', tagline: 'Upload a chat screenshot or type the exact conversation.' },
    { id: 'starter', label: 'Convo Starters', icon: '🚀', tagline: 'Upload a photo of them/their activity or describe their bio.' },
    { id: 'awkward', label: 'Awkward Situations', icon: '😅', tagline: 'Describe the tricky situation in detail to get expert advice.' },
  ];

  const handleProcess = async () => {
    if (!inputText && !file) return;
    setIsLoading(true);
    setResult(null);
    
    try {
      // In a production scenario with file uploads, you would use FormData.
      // For this unified tool, we will send everything as JSON for now (if text).
      // A dedicated server action or API route handles the actual Gemini request.
      
      const payload = {
        type: activeTab,
        context: inputText,
        // file data would be sent here if handling base64, otherwise multipart/form-data
      };

      const response = await fetch('/api/unified-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
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
          min-height: 200px;
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
          min-height: 200px;
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
            onClick={() => { setActiveTab(tab.id); setResult(null); setInputText(''); setFile(null); }}
          >
            <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass fade-in" style={{ padding: '3rem', borderRadius: '32px', border: '1px solid var(--accent-purple)', boxShadow: '0 10px 40px rgba(139, 92, 246, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.8rem' }}>{currentTabInfo.icon} {currentTabInfo.label}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{currentTabInfo.tagline}</p>
        </div>

        <div className={`action-area ${activeTab === 'awkward' ? 'single-col' : ''}`}>
          {/* File Upload (Hidden for Awkward Situations) */}
          {activeTab !== 'awkward' && (
            <div className="file-drop" onClick={() => alert("File upload functionality to be linked to storage bucket later.")}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📤</div>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Click or drag file here</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Supports JPG, PNG (Max 5MB)</div>
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

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button 
            className="gradient-bg" 
            disabled={!inputText && !file || isLoading}
            onClick={handleProcess}
            style={{ 
              padding: '1.2rem 3rem', 
              borderRadius: '16px', 
              color: '#fff', 
              fontWeight: '700', 
              fontSize: '1.1rem',
              border: 'none',
              cursor: (!inputText && !file) || isLoading ? 'not-allowed' : 'pointer',
              opacity: (!inputText && !file) || isLoading ? 0.6 : 1,
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
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>
                      Option {idx + 1}
                    </div>
                    <div style={{ fontSize: '1.1rem', color: '#fff', lineHeight: '1.5' }}>
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
