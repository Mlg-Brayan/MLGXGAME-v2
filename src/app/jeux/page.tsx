import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryListingPage from '@/components/CategoryListingPage';
import { supabase } from '@/lib/supabaseClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tous les jeux - MLGxGame',
  description: 'Découvrez tous nos jeux : en ligne, mobile et PC, réunis en un seul endroit.',
};

export default async function AllGamesPage() {
  const { data: webGames } = await supabase.from('games').select('*').contains('platform', ['web']);
  const { data: appGames } = await supabase.from('games').select('*').overlaps('platform', ['android', 'ios']);
  const { data: pcGames } = await supabase.from('games').select('*').contains('platform', ['pc']);

  return (
    <main>
      <Header />
      <p style={{ padding: '24px clamp(16px, 4vw, 48px) 0', color: 'var(--text-secondary)', maxWidth: '700px' }}>
        Tout notre catalogue de jeux réuni ici : jeux en ligne, jeux mobile et jeux PC — un seul
        endroit pour tout explorer.
      </p>
      <CategoryListingPage items={webGames ?? []} itemHrefPrefix="/jeux" pageTitle="Jeux en ligne" />
      <CategoryListingPage items={appGames ?? []} itemHrefPrefix="/jeux" pageTitle="Jeux Mobile" />
      <CategoryListingPage items={pcGames ?? []} itemHrefPrefix="/jeux" pageTitle="Jeux PC" />
      <Footer />
    </main>
  );
}