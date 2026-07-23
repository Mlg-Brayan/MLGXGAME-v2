import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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
          <span className="detail-price">{item.price} €</span>
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