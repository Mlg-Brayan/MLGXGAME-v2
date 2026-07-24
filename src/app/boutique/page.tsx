import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryListingPage from '@/components/CategoryListingPage';
import { supabase } from '@/lib/supabaseClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boutique Gaming - MLGXGAME',
  description: 'Manettes, casques, souris et accessoires gaming sélectionnés pour améliorer votre expérience de jeu.',
};

export default async function BoutiquePage() {
  const { data: items } = await supabase.from('boutique').select('*');

  return (
    <main>
      <Header />
      <p style={{ padding: '24px clamp(16px, 4vw, 48px) 0', color: 'var(--text-secondary)', maxWidth: '700px' }}>
        Manettes, casques, souris et accessoires gaming sélectionnés pour améliorer votre
        expérience de jeu.
      </p>
      <CategoryListingPage items={items ?? []} itemHrefPrefix="/boutique" pageTitle="Boutique" />
      <Footer />
    </main>
  );
}