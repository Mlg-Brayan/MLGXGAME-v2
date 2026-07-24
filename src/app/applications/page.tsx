import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryListingPage from '@/components/CategoryListingPage';
import { supabase } from '@/lib/supabaseClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Applications Gaming - MLGXGAME',
  description: 'Découvrez les meilleures applications pour gamers : communication, streaming, optimisation et bien plus.',
};

export default async function ApplicationsPage() {
  const { data: apps } = await supabase.from('applications').select('*');

  return (
    <main>
      <Header />
      <p style={{ padding: '24px clamp(16px, 4vw, 48px) 0', color: 'var(--text-secondary)', maxWidth: '700px' }}>
        Découvrez les meilleures applications pour gamers : communication, streaming, optimisation
        et bien plus.
      </p>
      <CategoryListingPage items={apps ?? []} itemHrefPrefix="/applications" pageTitle="Applications Gaming" />
      <Footer />
    </main>
  );
}