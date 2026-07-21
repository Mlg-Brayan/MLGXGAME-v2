'use client';

import Image from 'next/image';
import Link from 'next/link';
import { trackCategoryClick } from '@/lib/trackInteraction';
import { Game } from '@/lib/mockGames';

export default function GameCard({ game }: { game: Game }) {
  const handleClick = () => {
    if (game.category) trackCategoryClick(game.category);
  };

  return (
    <Link href={`/jeux/${game.slug}`} className="game-card" onClick={handleClick}>
      <div className="game-card-image">
        <Image src={game.image_url} alt={game.title} fill sizes="200px" />
      </div>
      <p className="game-card-title">{game.title}</p>
      <p className="game-card-category">{game.category}</p>
    </Link>
  );
}