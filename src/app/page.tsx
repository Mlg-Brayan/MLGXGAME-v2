import Header from '@/components/Header';
import GameSection from '@/components/GameSection';
import { supabase } from '@/lib/supabaseClient';
import BestGamesChart from '@/components/BestGamesChart';

export default async function Home() {
  const { data: pcGames, error: pcError } = await supabase
    .from('games')
    .select('*')
    .contains('platform', ['pc']);

  const { data: appGames, error: appError } = await supabase
    .from('games')
    .select('*')
    .overlaps('platform', ['android', 'ios']);

  if (pcError) console.error('Erreur PC games:', pcError);
  if (appError) console.error('Erreur App games:', appError);

  return (
    <main>
      <Header />
      <GameSection title="Top Jeux PC" games={pcGames ?? []} />
      <GameSection title="Top Jeux Mobile" games={appGames ?? []} />
      <BestGamesChart />
    </main>
  );
}