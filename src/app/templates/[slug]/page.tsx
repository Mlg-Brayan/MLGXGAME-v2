import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { data: template } = await supabase
    .from('templates')
    .select('title, description, image_url, price')
    .eq('slug', slug)
    .single();

  if (!template) return { title: 'Template introuvable' };

  return {
    title: template.title,
    description: template.description?.slice(0, 160) ?? `Découvre ${template.title} sur MLGXGAME.`,
    openGraph: {
      title: `${template.title} - ${template.price} €`,
      description: template.description?.slice(0, 160) ?? '',
      images: template.image_url ? [{ url: template.image_url }] : [],
    },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !template) {
    notFound();
  }

  return (
    <main>
      <Header />
      <div className="detail-page">
        <div className="detail-hero">
          <Image src={template.image_url} alt={template.title} fill sizes="900px" />
        </div>
        <div className="detail-header">
  <h1 className="detail-title">{template.title}</h1>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <span className="detail-price">{template.price} €</span>
    <FavoriteButton itemType="templates" itemSlug={template.slug} itemTitle={template.title} itemImage={template.image_url} />
  </div>
</div>
        <span className="detail-category">{template.category}</span>
        <p className="detail-description">{template.description}</p>
        <div className="detail-cta-row">
          <a href="#" className="detail-cta">Acheter</a>
          {template.demo_url && (
            <a href={template.demo_url} target="_blank" rel="noopener noreferrer" className="detail-cta-secondary">
              Voir la démo
            </a>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}