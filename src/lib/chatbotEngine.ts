import { supabase } from './supabaseClient';

type Suggestion = {
  title: string;
  slug: string;
  type: string;
};

type BotResponse = {
  text: string;
  suggestions: Suggestion[];
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'FPS': ['tir', 'fps', 'shooter', 'arme'],
  'Aventure': ['aventure', 'exploration', 'survie'],
  'MOBA': ['moba'],
  'Battle Royale': ['battle royale', 'br'],
  'Party': ['party', 'entre amis', 'social'],
  'Stratégie': ['strategie', 'stratégie', 'reflexion'],
  'Arcade': ['arcade', 'simple', 'rapide'],
  'Sport': ['sport', 'foot', 'football'],
  'Simulation': ['simulation', 'vie', 'sims'],
  'Puzzle': ['puzzle', 'enigme', 'énigme', 'reflechir', 'réfléchir'],
  'Course': ['course', 'voiture', 'racing'],
  'Plateforme': ['plateforme', 'plateformer'],
};

const PLATFORM_KEYWORDS: Record<string, string[]> = {
  pc: ['pc', 'ordinateur', 'windows'],
  android: ['android', 'telephone', 'téléphone', 'mobile'],
  ios: ['ios', 'iphone'],
  web: ['navigateur', 'en ligne', 'sans telechargement', 'sans téléchargement'],
};

export async function getChatbotResponse(message: string): Promise<BotResponse> {
  const lower = message.toLowerCase();

  if (lower.includes('vote') || lower.includes('voter')) {
    return {
      text: 'Tu peux voter pour ton jeu préféré directement sur la page d\'accueil, dans la section "Meilleur jeu 2026 selon vous" !',
      suggestions: [{ title: 'Aller voter', slug: '/', type: 'link' }],
    };
  }

  if (lower.includes('premium')) {
    return {
      text: 'La section Premium est en cours de préparation, reviens bientôt pour en savoir plus !',
      suggestions: [],
    };
  }

  if (lower.includes('boutique') || lower.includes('acheter') || lower.includes('manette') || lower.includes('casque')) {
    return {
      text: 'Notre boutique propose des accessoires gaming sélectionnés (manettes, casques, souris...).',
      suggestions: [{ title: 'Voir la boutique', slug: '/boutique', type: 'link' }],
    };
  }

  if (lower.includes('gratuit')) {
    const { data } = await supabase.from('games').select('title, slug').eq('is_free', true).limit(5);
    return {
      text: 'Voici quelques jeux gratuits de notre catalogue :',
      suggestions: (data ?? []).map((g) => ({ title: g.title, slug: g.slug, type: 'jeux' })),
    };
  }

  const matchedCategories = Object.entries(CATEGORY_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([category]) => category);

  const matchedPlatforms = Object.entries(PLATFORM_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([platform]) => platform);

  if (matchedCategories.length > 0 || matchedPlatforms.length > 0) {
    let query = supabase.from('games').select('title, slug, category, platform');

    if (matchedCategories.length > 0) {
      query = query.in('category', matchedCategories);
    }
    if (matchedPlatforms.length > 0) {
      query = query.overlaps('platform', matchedPlatforms);
    }

    const { data } = await query.limit(5);

    if (data && data.length > 0) {
      return {
        text: `Voici ce que j'ai trouvé pour toi :`,
        suggestions: data.map((g) => ({ title: g.title, slug: g.slug, type: 'jeux' })),
      };
    }
  }

  const { data: titleMatch } = await supabase
    .from('games')
    .select('title, slug')
    .ilike('title', `%${message}%`)
    .limit(5);

  if (titleMatch && titleMatch.length > 0) {
    return {
      text: 'J\'ai trouvé ces résultats :',
      suggestions: titleMatch.map((g) => ({ title: g.title, slug: g.slug, type: 'jeux' })),
    };
  }

  return {
    text: 'Je n\'ai pas trouvé de correspondance exacte. Essaie de me dire un genre de jeu (FPS, aventure, sport...) ou une plateforme (PC, mobile, en ligne), ou utilise la barre de recherche en haut du site.',
    suggestions: [],
  };
}