# MLGXGAME — Résumé du projet (pour reprise de contexte)

## Vue d'ensemble
Site catalogue gaming en construction : jeux, applications gaming, templates web à vendre, boutique d'accessoires. Objectif : remplacer un ancien site statique HTML (`mlgxgame.vercel.app`) une fois terminé. Développeur : Malonga Brayan (objectif carrière : architecte IA), débutant en dev, travaille avec VS Code + Auto Save activé. sur son telephone avec acode et termux.

Dépôt GitHub : https://github.com/Mlg-Brayan/MLGXGAME-v2

## Stack technique
- **Next.js 16** (App Router) + TypeScript, projet `mlgxgame-v2`
- **Supabase** : base de données + authentification (projet ID `wfysheyeuyfinywlpwfi`)
- **Vercel** : hébergement, déployé sur `mlgxgame-v2.vercel.app` (deviendra `mlgxgame.vercel.app` à la bascule finale)
- **GitHub** : dépôt `Mlg-Brayan/MLGXGAME-v2`
- **Groq API** (llama-3.3-70b) : chatbot IA, gratuit — Gemini abandonné (modèles retirés trop vite, quota=0)
- **lucide-react** : icônes

## Design
- Palette : fond `#0D0D0D`, cartes `#1A1A1A`, texte `#F2F2F2`, accent violet `#7F77DD`/`#534AB7`
- Logo : "MLGXGAME" avec "GXG" en violet (via `<tspan>` dans SVG)
- CSS fluide avec `clamp()` partout pour le responsive

## Base de données Supabase (tables principales)
- `games` (title, slug, category, platform[] type array, image_url, description, is_free, external_url)
- `applications`, `templates` (+price), `boutique` (+price) — même structure de base
- `votes` (game_id, user_identifier) — votes modifiables (delete si reclique)
- `comments` (name, message, user_id) — réservé aux connectés
- `discussion_posts` — forum, réservé aux connectés
- `favorites` (user_id, item_type, item_slug...) — contrainte unique
- `user_preferences` (user_id, category, score) — sync personnalisation
- `chat_usage` (user_identifier, created_at) — rate limiting chatbot
- `reports`, `banned_users`, `banned_words` — modération (auto-ban après 3 signalements via trigger SQL)
- RLS activé partout — piège fréquent : policies séparées par rôle (`anon` vs `authenticated`), penser aux deux

## Fonctionnalités construites
- Header avec logo, recherche (dropdown live + page résultats), auth, chatbot
- Navigation : hamburger animé, SideNav (desktop), BottomNav (mobile), toutes connectées via Context (`MenuContext`, `ChatContext`)
- Homepage : Top PC/Mobile (grandes cartes scroll auto), vote avec graphique, QuickNav (6 catégories), CategoryShowcase par section (icônes + couleurs distinctes), Recommandé (personnalisé), About, Commentaires, layout 2 colonnes >1400px (vote+recommandé à droite)
- Pages individuelles : `/jeux/[slug]`, `/applications/[slug]`, `/templates/[slug]`, `/boutique/[slug]` — avec favoris, tags, jeux similaires
- Pages catalogue : `/pc`, `/mobile`, `/online`, `/applications`, `/templates`, `/boutique`, `/jeux` (tous) — avec `CategoryListingPage` (filtres, fil d'Ariane, retour en haut, badges Gratuit/Payant)
- Auth Supabase : inscription/connexion, page `/profil` (stats, modifier pseudo, favoris récents), page `/favoris`
- Chatbot IA (Groq) : connaît tout le catalogue, propose des liens cliquables auto, personnalisé au nom de l'utilisateur connecté, rate-limité par utilisateur + global, détecte la langue automatiquement
- Modération : signalement (auto-ban après 3), table banned_words (à compléter avec liste LDNOOBW GitHub)
- Pages légales : Politique de confidentialité, CGU (avec charte de contenu : pas de violence extrême/sexualité/spiritisme)

## Personnalisation
- Suivi des clics par catégorie en `localStorage` + sync vers Supabase si connecté (`trackInteraction.ts`)
- `sortByPreference()` réordonne le contenu selon préférences

## À FAIRE / En attente
1. **Config Supabase Auth URL** (Site URL + Redirect URLs) — actuellement pointe vers `mlgxgame-v2.vercel.app`, à changer vers `mlgxgame.vercel.app` à la bascule finale
2. **Liste `banned_words`** à compléter (français + anglais minimum) depuis https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words
3. **Vérification bannissement à la connexion** — pas encore fait (bloquer login si email/user_id dans `banned_users`)
4. **Panel admin** pour review des signalements — pas encore construit
5. **Emplacement Premium** — mentionné dans le menu, jamais construit
6. **SEO avancé** : sitemap.xml, robots.txt, données structurées — pas fait
7. **Migration finale** : connecter le projet Vercel existant (`mlgxgame.vercel.app`) à ce nouveau dépôt
8. Vérifier variables d'environnement sur Vercel : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`

## Pièges/erreurs récurrentes rencontrées
- Copier-coller dans VS Code perd parfois des balises `<a>` ou lignes entières — toujours vérifier après collage
- RLS Supabase : penser à créer une policy par rôle ET par opération séparément
- Toujours redémarrer `npm run dev` après modif de `.env.local`
