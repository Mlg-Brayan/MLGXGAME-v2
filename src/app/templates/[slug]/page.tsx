import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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
          <span className="detail-price">{template.price} €</span>
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