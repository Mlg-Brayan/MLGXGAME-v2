'use client';

import { useRef, useState, useEffect } from 'react';
import GameCard from './GameCard';
import { Game } from '@/lib/mockGames';

export default function GameSection({ title, games }: { title: string; games: Game[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [dotCount, setDotCount] = useState(1);

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

  const scrollToPage = (index: number) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollTo({ left: index * row.clientWidth, behavior: 'smooth' });
  };

  return (
    <section className="game-section">
      <h2>{title}</h2>
      <div className="game-row" ref={rowRef}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {dotCount > 1 && (
        <div className="dots-container">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              className={`dot ${i === activeDot ? 'dot-active' : ''}`}
              onClick={() => scrollToPage(i)}
              aria-label={`Aller à la page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}