import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';import FavoriteButton from '@/components/FavoriteButton';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { data: item } = await supabase
    .from('boutique')
    .select('title, description, image_url, price')
    .eq('slug', slug)
    .single();

  if (!item) return { title: 'Produit introuvable' };

  return {
    title: item.title,
    description: item.description?.slice(0, 160) ?? `Découvre ${item.title} sur MLGxGame.`,
    openGraph: {
      title: `${item.title} - ${item.price} €`,
      description: item.description?.slice(0, 160) ?? '',
      images: item.image_url ? [{ url: item.image_url }] : [],
    },
  };
}

export default async function BoutiqueItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: item, error } = await supabase
    .from('boutique')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !item) {
    notFound();
  }

  return (
    <main>
      <Header />
      <div className="detail-page">
        <div className="detail-hero">
          <Image src={item.image_url} alt={item.title} fill sizes="900px" />
        </div>
        <div className="detail-header">
  <h1 className="detail-title">{item.title}</h1>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <span className="detail-price">{item.price} €</span>
    <FavoriteButton itemType="boutique" itemSlug={item.slug} itemTitle={item.title} itemImage={item.image_url} />
  </div>
</div>
        <span className="detail-category">{item.category}</span>
        <p className="detail-description">{item.description}</p>
        {item.affiliate_url ? (
          <a href={item.affiliate_url} target="_blank" rel="noopener noreferrer" className="detail-cta">
            Voir le produit
          </a>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Lien d&apos;achat bientôt disponible.
          </p>
        )}
      </div>
      <Footer />
    </main>
  );
}