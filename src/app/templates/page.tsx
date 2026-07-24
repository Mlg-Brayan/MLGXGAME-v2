import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryListingPage from '@/components/CategoryListingPage';
import { supabase } from '@/lib/supabaseClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Templates Web - MLGXGAME',
  description: 'Des templates web prêts à l\'emploi pour lancer votre projet rapidement : portfolio, e-commerce, blog et plus.',
};

export default async function TemplatesPage() {
  const { data: templates } = await supabase.from('templates').select('*');

  return (
    <main>
      <Header />
      <p style={{ padding: '24px clamp(16px, 4vw, 48px) 0', color: 'var(--text-secondary)', maxWidth: '700px' }}>
        Des templates web prêts à l&apos;emploi pour lancer votre projet rapidement : portfolio,
        e-commerce, blog et plus.
      </p>
      <CategoryListingPage items={templates ?? []} itemHrefPrefix="/templates" pageTitle="Templates Web" />
      <Footer />
    </main>
  );
}