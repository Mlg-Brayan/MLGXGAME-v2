import Header from '@/components/Header';
import GameSection from '@/components/GameSection';
import { topPcGames, topAppGames } from '@/lib/mockGames';

export default function Home() {
  return (
    <main>
      <Header />
      <GameSection title="Top Jeux PC" games={topPcGames} />
      <GameSection title="Top Jeux Mobile" games={topAppGames} />
    </main>
  );
}