import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import SearchResults from '@/components/SearchResults';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  let results: { id: number; title: string; slug: string; image_url: string; type: string }[] = [];

  if (query.length > 0) {
    const [games, apps, templates, boutique] = await Promise.all([
      supabase.from('games').select('id, title, slug, image_url').ilike('title', `%${query}%`),
      supabase.from('applications').select('id, title, slug, image_url').ilike('title', `%${query}%`),
      supabase.from('templates').select('id, title, slug, image_url').ilike('title', `%${query}%`),
      supabase.from('boutique').select('id, title, slug, image_url').ilike('title', `%${query}%`),
    ]);

    results = [
      ...(games.data ?? []).map((g) => ({ ...g, type: 'jeux' })),
      ...(apps.data ?? []).map((a) => ({ ...a, type: 'applications' })),
      ...(templates.data ?? []).map((t) => ({ ...t, type: 'templates' })),
      ...(boutique.data ?? []).map((b) => ({ ...b, type: 'boutique' })),
    ];
  }

  return (
    <main>
      <Header />
      <SearchResults query={query} results={results} />
      <Footer />
    </main>
  );
}