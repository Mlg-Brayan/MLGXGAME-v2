import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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
        <h1 className="detail-title">{app.title}</h1>
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