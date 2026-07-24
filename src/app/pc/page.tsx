import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryListingPage from '@/components/CategoryListingPage';
import { supabase } from '@/lib/supabaseClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jeux PC - MLGXGAME',
  description: 'Découvrez notre sélection de jeux PC, gratuits ou payants, des FPS compétitifs aux jeux d\'aventure en monde ouvert.',
};

export default async function PcGamesPage() {
  const { data: games } = await supabase
    .from('games')
    .select('*')
    .contains('platform', ['pc']);

  return (
    <main>
      <Header />
      <p style={{ padding: '24px clamp(16px, 4vw, 48px) 0', color: 'var(--text-secondary)', maxWidth: '700px' }}>
  Découvrez notre sélection de jeux PC, des FPS compétitifs aux jeux d&apos;aventure en monde
  ouvert — gratuits ou payants selon vos envies. Un catalogue mis à jour régulièrement pour tous
  les styles de joueurs.
</p>
      <CategoryListingPage items={games ?? []} itemHrefPrefix="/jeux" pageTitle="Jeux PC" />
      <Footer />
    </main>
  );
}