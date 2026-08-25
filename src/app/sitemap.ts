import { supabase } from '@/lib/supabaseClient';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://MLGxGame-v2.vercel.app';

  const { data: games } = await supabase.from('games').select('slug');
  const { data: applications } = await supabase.from('applications').select('slug');
  const { data: templates } = await supabase.from('templates').select('slug');
  const { data: boutique } = await supabase.from('boutique').select('slug');

  const staticPages = [
    '', '/pc', '/mobile', '/online', '/jeux', '/applications',
    '/templates', '/boutique', '/discussion', '/premium', '/recherche',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const gamePages = (games ?? []).map((g) => ({
    url: `${baseUrl}/jeux/${g.slug}`,
    lastModified: new Date(),
  }));

  const appPages = (applications ?? []).map((a) => ({
    url: `${baseUrl}/applications/${a.slug}`,
    lastModified: new Date(),
  }));

  const templatePages = (templates ?? []).map((t) => ({
    url: `${baseUrl}/templates/${t.slug}`,
    lastModified: new Date(),
  }));

  const boutiquePages = (boutique ?? []).map((b) => ({
    url: `${baseUrl}/boutique/${b.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...gamePages, ...appPages, ...templatePages, ...boutiquePages];
}