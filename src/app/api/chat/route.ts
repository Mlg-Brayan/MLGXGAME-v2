import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

const MAX_REQUESTS_PER_MINUTE_PER_USER = 5;
const MAX_REQUESTS_PER_MINUTE_GLOBAL = 25;

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json();
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();

    const { count: globalCount } = await supabase
      .from('chat_usage')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneMinuteAgo);

    if (globalCount !== null && globalCount >= MAX_REQUESTS_PER_MINUTE_GLOBAL) {
      return NextResponse.json({
        reply: "Notre assistant est très demandé en ce moment ! Réessaie dans une minute.",
        suggestions: [],
      });
    }

    if (userId) {
      const { count: userCount } = await supabase
        .from('chat_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_identifier', userId)
        .gte('created_at', oneMinuteAgo);

      if (userCount !== null && userCount >= MAX_REQUESTS_PER_MINUTE_PER_USER) {
        return NextResponse.json({
          reply: "Tu envoies pas mal de messages ! Attends une minute avant de continuer.",
          suggestions: [],
        });
      }
    }

    await supabase.from('chat_usage').insert({ user_identifier: userId ?? 'anonymous' });

    const [games, apps, templates, boutique] = await Promise.all([
      supabase.from('games').select('title, slug, category, platform, is_free').limit(40),
      supabase.from('applications').select('title, slug, category').limit(20),
      supabase.from('templates').select('title, slug, category, price').limit(20),
      supabase.from('boutique').select('title, slug, category, price').limit(20),
    ]);

    const allItems = [
      ...(games.data ?? []).map((g) => ({ ...g, type: 'jeux' })),
      ...(apps.data ?? []).map((a) => ({ ...a, type: 'applications' })),
      ...(templates.data ?? []).map((t) => ({ ...t, type: 'templates' })),
      ...(boutique.data ?? []).map((b) => ({ ...b, type: 'boutique' })),
    ];

    const catalogSummary = allItems
      .map((item) => `[${item.type}] ${item.title} | slug: ${item.slug} | ${item.category}`)
      .join('\n');

    const systemPrompt = `Tu es l'assistant du site MLGXGAME. Le site propose 4 types de contenus : des jeux vidéo, des applications gaming, des templates web à vendre, et une boutique d'accessoires gaming.

Voici le catalogue complet disponible (format : [type] Titre | slug | catégorie) :
${catalogSummary}

Ton rôle : comprendre l'intention du visiteur, même implicite, et proposer le bon contenu du catalogue, proactivement.

Règles strictes :
- Recommande UNIQUEMENT des éléments présents dans le catalogue ci-dessus
- Sois concis, amical, naturel
- Le site ne référence aucun contenu violent extrême, sexuel ou lié au spiritisme
- Réponds toujours dans la même langue que le message du visiteur
- OBLIGATOIRE : dès que tu mentionnes ou recommandes un élément du catalogue, ajoute à la toute fin de ta réponse, sur sa propre ligne, exactement ce format :
ITEMS: type:slug,type:slug
- Si aucun élément précis n'est recommandé, n'ajoute pas cette ligne`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
      }),
    });

    const groqData = await groqRes.json();
    console.log('Réponse Groq complète:', JSON.stringify(groqData, null, 2));
    const fullText = groqData.choices?.[0]?.message?.content ?? '';

    const itemsLineMatch = fullText.match(/ITEMS:\s*([a-zA-Z0-9:,_-]+)/i);
    let suggestions: { title: string; slug: string; type: string }[] = [];
    let cleanText = fullText;

    if (itemsLineMatch) {
      const pairs = itemsLineMatch[1].split(',').map((p: string) => p.trim());
      suggestions = pairs
        .map((pair: string) => {
          const [type, slug] = pair.split(':').map((s) => s.trim());
          const found = allItems.find((item) => item.type === type && item.slug === slug);
          return found ? { title: found.title, slug: found.slug, type: found.type } : null;
        })
        .filter((s: unknown): s is { title: string; slug: string; type: string } => s !== null);

      cleanText = fullText.replace(/ITEMS:\s*[a-zA-Z0-9:,_-]+/i, '').trim();
    }

    return NextResponse.json({ reply: cleanText, suggestions });
  } catch (error) {
    console.error('Erreur chatbot:', error);
    return NextResponse.json({ reply: "Désolé, une erreur est survenue. Réessaie dans un instant.", suggestions: [] }, { status: 500 });
  }
}