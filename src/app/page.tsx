import Header from '@/components/Header';
import GameSection from '@/components/GameSection';
import BestGamesChart from '@/components/BestGamesChart';
import QuickNav from '@/components/QuickNav';
import CategoryShowcase from '@/components/CategoryShowcase';
import { supabase } from '@/lib/supabaseClient';

export default async function Home() {
  const { data: pcGames } = await supabase.from('games').select('*').contains('platform', ['pc']);
  const { data: appGames } = await supabase.from('games').select('*').overlaps('platform', ['android', 'ios']);
  const { data: webGames } = await supabase.from('games').select('*').contains('platform', ['web']);
  const { data: applications } = await supabase.from('applications').select('*');
  const { data: templates } = await supabase.from('templates').select('*');
  const { data: boutique } = await supabase.from('boutique').select('*');

  return (
    <main>
      <Header />
      <GameSection title="Top Jeux PC" games={pcGames ?? []} />
      <GameSection title="Top Jeux Mobile" games={appGames ?? []} />
      <BestGamesChart />
      <QuickNav />
      <CategoryShowcase title="Jeux en ligne" items={webGames ?? []} itemHrefPrefix="/jeux" seeMoreHref="/online" iconName="globe" accentColor="#7F77DD" />
      <CategoryShowcase title="Jeux PC" items={pcGames ?? []} itemHrefPrefix="/jeux" seeMoreHref="/pc" iconName="monitor" accentColor="#4FA3E3" />
      <CategoryShowcase title="Jeux Mobile" items={appGames ?? []} itemHrefPrefix="/jeux" seeMoreHref="/mobile" iconName="smartphone" accentColor="#4FCB8F" />
      <CategoryShowcase title="Applications Gaming" items={applications ?? []} itemHrefPrefix="/applications" seeMoreHref="/applications" iconName="appwindow" accentColor="#E3A64F" />
      <CategoryShowcase title="Templates Web" items={templates ?? []} itemHrefPrefix="/templates" seeMoreHref="/templates" iconName="template" accentColor="#E35C8A" />
      <CategoryShowcase title="Boutique" items={boutique ?? []} itemHrefPrefix="/boutique" seeMoreHref="/boutique" iconName="shop" accentColor="#B565E0" />
    </main>
  );
}