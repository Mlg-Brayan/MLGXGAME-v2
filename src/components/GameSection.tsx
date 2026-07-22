'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/lib/mockGames';
import { sortByPreference, trackCategoryClick } from '@/lib/trackInteraction';

export default function GameSection({ title, games }: { title: string; games: Game[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [dotCount, setDotCount] = useState(1);
  const [sortedGames, setSortedGames] = useState(games);

useEffect(() => {
  setSortedGames(sortByPreference(games));
}, [games]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const updateDotCount = () => {
      const count = Math.ceil(row.scrollWidth / row.clientWidth);
      setDotCount(count > 0 ? count : 1);
    };

    const handleScroll = () => {
      const index = Math.round(row.scrollLeft / row.clientWidth);
      setActiveDot(index);
    };

    updateDotCount();
    row.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateDotCount);

    return () => {
      row.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateDotCount);
    };
  }, [games]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || sortedGames.length <= 1) return;

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
  }, [sortedGames]);
  if (games.length === 0) return null;

  return (
    <section className="game-section">
      <h2>{title}</h2>
      <div className="recommended-row" ref={rowRef}>
        {sortedGames.map((game) => (
          <Link
            key={game.id}
            href={`/jeux/${game.slug}`}
            className="recommended-card"
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

      {dotCount > 1 && (
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((activeDot + 1) / dotCount) * 100}%` }}
          />
        </div>
      )}
    </section>
  );
}