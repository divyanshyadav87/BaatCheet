"use client";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('baatcheet_logged_in');
    const email = localStorage.getItem('baatcheet_user_email');
    if (!isLoggedIn || !email) {
      router.push('/login');
    } else {
      setIsAuthChecking(false);
    }
  }, [router]);

  if (isAuthChecking) {
    return <div style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Authenticating...</div>;
  }

  return (
    <div className="dash-container" style={{ display: 'flex', minHeight: '100vh', background: '#050508' }}>
      <style>{`
        .dash-main { margin-left: 280px; width: calc(100% - 280px); padding: 3rem 4rem; min-height: 100vh; overflow-y: auto; }
        @media (max-width: 900px) {
          .dash-container { flex-direction: column; }
          .dash-main { margin-left: 0; width: 100%; padding: 2rem 1.5rem 100px 1.5rem; }
        }
      `}</style>
      <Sidebar />
      <main className="dash-main">
        {children}
      </main>
    </div>
  );
}
