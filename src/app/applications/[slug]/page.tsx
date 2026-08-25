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

  const { data: app } = await supabase
    .from('applications')
    .select('title, description, image_url')
    .eq('slug', slug)
    .single();

  if (!app) return { title: 'Application introuvable' };

  return {
    title: app.title,
    description: app.description?.slice(0, 160) ?? `Découvre ${app.title} sur MLGxGame.`,
    openGraph: {
      title: app.title,
      description: app.description?.slice(0, 160) ?? '',
      images: app.image_url ? [{ url: app.image_url }] : [],
    },
  };
}

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: app, error } = await supabase
    .from('applications')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !app) {
    notFound();
  }

  return (
    <main>
      <Header />
      <div className="detail-page">
        <div className="detail-hero">
          <Image src={app.image_url} alt={app.title} fill sizes="900px" />
        </div>
       <div className="detail-header">
  <h1 className="detail-title">{app.title}</h1>
  <FavoriteButton itemType="applications" itemSlug={app.slug} itemTitle={app.title} itemImage={app.image_url} />
</div>
        <span className="detail-category">{app.category}</span>
        <p className="detail-description">{app.description}</p>
        {app.download_url && (
          <a href={app.download_url} target="_blank" rel="noopener noreferrer" className="detail-cta">
            Télécharger
          </a>
        )}
      </div>
      <Footer />
    </main>
  );
}