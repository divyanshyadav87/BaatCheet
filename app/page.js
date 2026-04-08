import Navbar from "@/components/Navbar";

export default function Home() {
  const features = [
    { title: "Smart Replies", desc: "AI-generated responses that match the conversation tone perfectly.", icon: "💬" },
    { title: "Conversation Analysis", desc: "Deep insights into your messaging patterns and social dynamics.", icon: "📊" },
    { title: "Confidence Coach", desc: "Build social confidence with personalized AI-driven tips.", icon: "🛡️" },
    { title: "Rizz Generator", desc: "Get witty, charming replies that keep conversations going.", icon: "⚡" },
    { title: "Dating Assistant", desc: "Master the art of dating conversations with AI guidance.", icon: "💖" },
    { title: "Social Score", desc: "Track your improvement with a comprehensive social skill score.", icon: "⭐" },
  ];

  const testimonials = [
    { name: "Arjun M.", role: "College Student", text: '"My texting game went from 0 to 100. Social Wizard literally saved my dating life. 🔥"', avatar: "A" },
    { name: "Priya S.", role: "Marketing Pro", text: '"The conversation analysis feature helped me understand where I was going wrong. Game changer."', avatar: "P" },
    { name: "Rahul K.", role: "Software Engineer", text: '"I used to overthink every message. Now I just ask the AI and send with confidence."', avatar: "R" },
  ];

  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding flex-center" style={{ flexDirection: 'column', textAlign: 'center', paddingTop: '12rem' }}>
        <div className="glass" style={{ padding: '0.4rem 1.2rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--accent-purple)' }}>✨</span> Powered by AI · Made for India
        </div>
        
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '800', lineHeight: '1.1', maxWidth: '900px', marginBottom: '1.5rem' }}>
          Master Conversations <br />
          <span className="gradient-text">with AI</span>
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Get smart replies, improve dating skills, and boost confidence — all powered by AI that understands Indian conversations.
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button className="gradient-bg" style={{ padding: '1.2rem 2.5rem', borderRadius: '16px', color: '#fff', fontWeight: '700', fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)' }}>
            Get Started →
          </button>
          <button className="glass" style={{ padding: '1.2rem 2.5rem', borderRadius: '16px', color: '#fff', fontWeight: '600', fontSize: '1.1rem' }}>
            Try Demo
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="section-padding container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Everything You Need to <span className="gradient-text">Level Up</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>AI-powered tools designed to make every conversation count.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {features.map((f, i) => (
            <div key={i} className="glass" style={{ padding: '2.5rem', borderRadius: '24px', transition: 'transform 0.3s', cursor: 'default' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding" style={{ background: 'rgba(139, 92, 246, 0.03)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Loved by <span className="gradient-text">Thousands</span></h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: '600' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.role}</div>
                  </div>
                </div>
                <p style={{ fontStyle: 'italic', color: '#eee', marginBottom: '1.5rem', lineHeight: '1.6' }}>{t.text}</p>
                <div style={{ color: '#fbbf24' }}>★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Simple <span className="gradient-text">Pricing</span></h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {/* Free Tier */}
          <div className="glass" style={{ padding: '3rem 2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Free</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>₹0<span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-secondary)' }}>/forever</span></div>
            <ul style={{ listStyle: 'none', marginBottom: '3rem', flex: 1 }}>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> 5 chats/day</li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Basic suggestions</li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Social score</li>
            </ul>
            <button className="glass" style={{ padding: '1rem', borderRadius: '12px', fontWeight: '600' }}>Get Started</button>
          </div>

          {/* Pro Tier (Highlighted) */}
          <div className="glass" style={{ 
            padding: '3rem 2rem', 
            borderRadius: '24px', 
            display: 'flex', 
            flexDirection: 'column',
            border: '2px solid var(--accent-purple)',
            position: 'relative',
            transform: 'scale(1.05)',
            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)'
          }}>
            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gradient-primary)', padding: '0.3rem 1rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 'bold' }}>MOST POPULAR</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Pro</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>₹499<span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-secondary)' }}>/month</span></div>
            <ul style={{ listStyle: 'none', marginBottom: '3rem', flex: 1 }}>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Unlimited chats</li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Advanced AI analysis</li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Rizz generator</li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Priority support</li>
            </ul>
            <button className="gradient-bg" style={{ padding: '1rem', borderRadius: '12px', fontWeight: '700', color: '#fff' }}>Go Pro</button>
          </div>

          {/* Elite Tier */}
          <div className="glass" style={{ padding: '3rem 2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Elite</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>₹999<span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-secondary)' }}>/month</span></div>
            <ul style={{ listStyle: 'none', marginBottom: '3rem', flex: 1 }}>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Everything in Pro</li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> 1-on-1 AI coaching</li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> Custom personality</li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#10b981' }}>✓</span> White-glove onboarding</li>
            </ul>
            <button className="glass" style={{ padding: '1rem', borderRadius: '12px', fontWeight: '600' }}>Go Elite</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container section-padding" style={{ borderTop: '1px solid var(--card-border)', marginTop: '5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: '#fff' }}>
          ✨ BaatCheet
        </div>
        <div>© 2024 BaatCheet AI. Made with ❤️ in India.</div>
      </footer>
    </main>
  );
}
