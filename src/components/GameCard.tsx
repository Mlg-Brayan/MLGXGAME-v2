import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/lib/mockGames';

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/jeux/${game.slug}`} className="game-card">
      <div className="game-card-image">
        <Image src={game.image} alt={game.title} fill sizes="200px" />
      </div>
      <p className="game-card-title">{game.title}</p>
      <p className="game-card-category">{game.category}</p>
    </Link>
  );
}
