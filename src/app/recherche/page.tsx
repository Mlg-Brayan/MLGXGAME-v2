import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import SearchResults from '@/components/SearchResults';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; platform?: string; genre?: string; price?: string }>;
}) {
  const { q, platform, genre, price } = await searchParams;
  const query = q?.trim() ?? '';

  let results: { id: number; title: string; slug: string; image_url: string; type: string }[] = [];
  let genres: string[] = [];

  if (query.length > 0) {
    let gamesQuery = supabase
      .from('games')
      .select('id, title, slug, image_url, category, platform, is_free')
      .ilike('title', `%${query}%`);

    if (platform) gamesQuery = gamesQuery.contains('platform', [platform]);
    if (genre) gamesQuery = gamesQuery.eq('category', genre);
    if (price === 'free') gamesQuery = gamesQuery.eq('is_free', true);
    if (price === 'paid') gamesQuery = gamesQuery.eq('is_free', false);

    const [games, apps, templates, boutique, allCategories] = await Promise.all([
      gamesQuery,
      supabase.from('applications').select('id, title, slug, image_url').ilike('title', `%${query}%`),
      supabase.from('templates').select('id, title, slug, image_url').ilike('title', `%${query}%`),
      supabase.from('boutique').select('id, title, slug, image_url').ilike('title', `%${query}%`),
      supabase.from('games').select('category'),
    ]);

    results = [
      ...(games.data ?? []).map((g) => ({ ...g, type: 'jeux' })),
      ...(apps.data ?? []).map((a) => ({ ...a, type: 'applications' })),
      ...(templates.data ?? []).map((t) => ({ ...t, type: 'templates' })),
      ...(boutique.data ?? []).map((b) => ({ ...b, type: 'boutique' })),
    ];

    genres = Array.from(new Set((allCategories.data ?? []).map((c) => c.category))).sort();
  }

  return (
    <main>
      <Header />
      <SearchResults
        query={query}
        results={results}
        genres={genres}
        activeFilters={{ platform, genre, price }}
      />
      <Footer />
    </main>
  );
}