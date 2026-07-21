'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { getTopCategories, trackCategoryClick } from '@/lib/trackInteraction';
import { Game } from '@/lib/mockGames';

export default function RecommendedSection() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadRecommended() {
      const topCategories = getTopCategories(3);
      let matchedGames: Game[] = [];

      if (topCategories.length > 0) {
        const { data } = await supabase
          .from('games')
          .select('*')
          .in('category', topCategories)
          .limit(10);
        matchedGames = data ?? [];
      }

      if (matchedGames.length < 5) {
        const { data: fallback } = await supabase
          .from('games')
          .select('*')
          .limit(10);

        const existingIds = new Set(matchedGames.map((g) => g.id));
        const extra = (fallback ?? []).filter((g) => !existingIds.has(g.id));
        matchedGames = [...matchedGames, ...extra].slice(0, 10);
      }

      setGames(matchedGames);
      setLoading(false);
    }

    loadRecommended();
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || games.length === 0) return;

    const interval = setInterval(() => {
      const cardWidth = row.firstElementChild?.clientWidth ?? 300;
      const gap = 16;
      const maxScroll = row.scrollWidth - row.clientWidth;

      if (row.scrollLeft >= maxScroll - 5) {
        row.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        row.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [games]);

  if (loading || games.length === 0) return null;

  return (
    <section className="recommended-section">
      <h2>Recommandé pour vous</h2>
      <div className="recommended-row" ref={rowRef}>
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/jeux/${game.slug}`}
            className="recommended-big-card"
            onClick={() => trackCategoryClick(game.category)}
          >
            <Image src={game.image_url} alt={game.title} fill sizes="500px" className="recommended-card-image" />
            <div className="recommended-card-overlay">
              <span className="recommended-card-title">{game.title}</span>
              <span className="recommended-card-category">{game.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}