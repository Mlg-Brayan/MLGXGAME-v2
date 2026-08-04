import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import VoteButton from '@/components/VoteButton';
import FavoriteButton from '@/components/FavoriteButton';

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !game) {
    notFound();
  }

  const { data: similarGames } = await supabase
    .from('games')
    .select('*')
    .eq('category', game.category)
    .neq('id', game.id)
    .limit(4);

  return (
    <main>
      <Header />
      <div className="detail-page">
        <div className="detail-hero">
          <Image src={game.image_url} alt={game.title} fill sizes="900px" />
        </div>
       <div className="detail-header">
  <h1 className="detail-title">{game.title}</h1>
  <div style={{ display: 'flex', gap: '10px' }}>
    <FavoriteButton itemType="jeux" itemSlug={game.slug} itemTitle={game.title} itemImage={game.image_url} />
    <VoteButton gameId={game.id} />
  </div>
</div>

        <div className="detail-tags">
          <Link href={`/pc?category=${encodeURIComponent(game.category)}`} className="detail-tag">
            {game.category}
          </Link>
          {game.platform?.map((p: string) => (
            <span key={p} className="detail-tag detail-tag-muted">
              {p}
            </span>
          ))}
          <span className={`detail-tag ${game.is_free === false ? 'detail-tag-paid' : 'detail-tag-free'}`}>
            {game.is_free === false ? 'Payant' : 'Gratuit'}
          </span>
        </div>

        <p className="detail-description">{game.description}</p>

        {game.external_url && (
          <a href={game.external_url} target="_blank" rel="noopener noreferrer" className="detail-cta">
            {game.platform?.includes('web') ? 'Jouer maintenant' : 'Télécharger / Voir le jeu'}
          </a>
        )}

        {similarGames && similarGames.length > 0 && (
          <div className="similar-games">
            <h2>Jeux similaires</h2>
            <div className="showcase-grid">
              {similarGames.map((g) => (
                <Link key={g.id} href={`/jeux/${g.slug}`} className="showcase-card">
                  <div className="showcase-card-image">
                    <Image src={g.image_url} alt={g.title} fill sizes="200px" />
                  </div>
                  <span className="showcase-card-title">{g.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
  href={
    game.platform?.includes('web')
      ? '/online'
      : game.platform?.includes('pc')
      ? '/pc'
      : '/mobile'
  }
  className="back-to-catalog"
>
  ← Retour au catalogue
</Link>
      </div>
      <Footer />
    </main>
  );
}