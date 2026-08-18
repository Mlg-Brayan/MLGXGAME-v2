import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Crown } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium - MLGXGAME',
  description: 'La section Premium arrive bientôt sur MLGXGAME.',
};

export default function PremiumPage() {
  return (
    <main>
      <Header />
      <div className="coming-soon">
        <Crown size={48} strokeWidth={1.5} className="coming-soon-icon" />
        <h1>Premium arrive bientôt</h1>
        <p>On y travaille activement. Reviens vite pour découvrir ce qu'on te prépare.</p>
      </div>
      <Footer />
    </main>
  );
}