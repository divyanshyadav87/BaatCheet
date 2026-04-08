"use client";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050508' }}>
      <Sidebar />
      <main style={{ 
        marginLeft: '280px', 
        width: 'calc(100% - 280px)', 
        padding: '3rem 4rem',
        minHeight: '100vh',
        overflowY: 'auto'
      }}>
        {children}
      </main>
    </div>
  );
}
