import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-outfit" });

export const metadata = {
  title: "BaatCheet ✨ | Master Conversations with AI",
  description: "Get smart replies, improve dating skills, and boost confidence with AI that understands Indian conversations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <div className="glow-ball" style={{ top: '-10%', right: '10%' }}></div>
        <div className="glow-ball" style={{ bottom: '20%', left: '5%' }}></div>
        {children}
      </body>
    </html>
  );
}
