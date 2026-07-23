import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import VoteButton from '@/components/VoteButton';

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

  return (
    <main>
      <Header />
      <div className="detail-page">
        <div className="detail-hero">
          <Image src={game.image_url} alt={game.title} fill sizes="900px" />
        </div>
        <div className="detail-header">
          <h1 className="detail-title">{game.title}</h1>
          <VoteButton gameId={game.id} />
        </div>
        <span className="detail-category">{game.category}</span>
        <p className="detail-description">{game.description}</p>
        <p className="detail-description">{game.description}</p>
{game.external_url && (
  <a href={game.external_url} target="_blank" rel="noopener noreferrer" className="detail-cta">
    {game.platform?.includes('web') ? 'Jouer maintenant' : 'Télécharger / Voir le jeu'}
  </a>
)}
      </div>
      <Footer />
    </main>
  );
}