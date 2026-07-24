import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryListingPage from '@/components/CategoryListingPage';
import { supabase } from '@/lib/supabaseClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jeux Mobile - MLGXGAME',
  description: 'Découvrez notre sélection de jeux mobile sur Android et iOS, gratuits ou payants, pour tous les styles de joueurs.',
};

export default async function MobileGamesPage() {
  const { data: games } = await supabase
    .from('games')
    .select('*')
    .overlaps('platform', ['android', 'ios']);

  return (
    <main>
      <Header />
      <p style={{ padding: '24px clamp(16px, 4vw, 48px) 0', color: 'var(--text-secondary)', maxWidth: '700px' }}>
        Découvrez notre sélection de jeux mobile sur Android et iOS, gratuits ou payants, pour tous
        les styles de joueurs.
      </p>
      <CategoryListingPage items={games ?? []} itemHrefPrefix="/jeux" pageTitle="Jeux Mobile" />
      <Footer />
    </main>
  );
}