import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

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

    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const systemPrompt = `Tu es l'assistant du site MLGXGAME. Le site propose 4 types de contenus : des jeux vidéo, des applications gaming (Discord, OBS...), des templates web à vendre, et une boutique d'accessoires gaming (manettes, casques...).

Voici le catalogue complet disponible (format : [type] Titre | slug | catégorie) :
${catalogSummary}

Ton rôle : comprendre l'intention du visiteur, même implicite, et proposer le bon contenu du catalogue, proactivement, sans qu'on te le demande explicitement. Exemples de comportement attendu :
- "Je m'ennuie" → propose des jeux
- "Je veux créer mon propre site" → propose des templates
- "Mon téléphone lag avec les jeux" → propose un accessoire de la boutique ou une application d'optimisation
- Une personne cite un jeu par son nom → confirme qu'il est dans le catalogue et propose son lien

Règles strictes :
- Recommande UNIQUEMENT des éléments présents dans le catalogue ci-dessus, jamais autre chose
- Sois concis, amical, naturel
- Le site ne référence aucun contenu violent extrême, sexuel ou lié au spiritisme
- Réponds toujours dans la même langue que le message du visiteur (détecte automatiquement sa langue)
- OBLIGATOIRE : dès que tu mentionnes ou recommandes un ou plusieurs éléments du catalogue (jeu, appli, template, produit boutique), ajoute à la toute fin de ta réponse, sur sa propre ligne, sans aucun formatage markdown autour, exactement ce format :
ITEMS: type:slug,type:slug
Exemple : ITEMS: jeux:minecraft,templates:portfolio-creatif
- Si aucun élément précis n'est recommandé, n'ajoute pas cette ligne du tout`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `Message du visiteur : ${message}` },
    ]);

    const fullText = result.response.text();

    const itemsLineMatch = fullText.match(/ITEMS:\s*([a-zA-Z0-9:,_-]+)/i);
    let suggestions: { title: string; slug: string; type: string }[] = [];
    let cleanText = fullText;

    if (itemsLineMatch) {
      const pairs = itemsLineMatch[1].split(',').map((p) => p.trim());
      suggestions = pairs
        .map((pair) => {
          const [type, slug] = pair.split(':').map((s) => s.trim());
          const found = allItems.find((item) => item.type === type && item.slug === slug);
          return found ? { title: found.title, slug: found.slug, type: found.type } : null;
        })
        .filter((s): s is { title: string; slug: string; type: string } => s !== null);

      cleanText = fullText.replace(/ITEMS:\s*[a-zA-Z0-9:,_-]+/i, '').trim();
    }

    return NextResponse.json({ reply: cleanText, suggestions });
  } catch (error) {
    console.error('Erreur chatbot:', error);
    return NextResponse.json({ reply: "Désolé, une erreur est survenue. Réessaie dans un instant.", suggestions: [] }, { status: 500 });
  }
}