import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';

export default async function OnlineGamesPage() {
  const { data: games } = await supabase
    .from('games')
    .select('*')
    .contains('platform', ['web']);

  return (
    <main>
      <Header />
      <div style={{ padding: '32px clamp(16px, 4vw, 48px)' }}>
        <h1>Jeux en ligne</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {games?.length ?? 0} jeu{(games?.length ?? 0) > 1 ? 'x' : ''}
        </p>
        <div className="showcase-grid">
          {(games ?? []).map((game) => (
            <Link key={game.id} href={`/jeux/${game.slug}`} className="showcase-card">
              <div className="showcase-card-image">
                <Image src={game.image_url} alt={game.title} fill sizes="200px" />
              </div>
              <span className="showcase-card-title">{game.title}</span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}