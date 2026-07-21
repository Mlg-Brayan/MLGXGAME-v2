export type Game = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  slug: string;
};

export const topPcGames: Game[] = [
  { id: '1', title: 'Minecraft', category: 'Aventure', image_url: '/games/minecraft.jpg', slug: 'minecraft' },
  { id: '2', title: 'Valorant', category: 'FPS', image_url: '/games/valorant.jpg', slug: 'valorant' },
  { id: '3', title: 'League of Legends', category: 'MOBA', image_url: '/games/lol.jpg', slug: 'league-of-legends' },
  { id: '4', title: 'Fortnite', category: 'Battle Royale', image_url: '/games/fortnite.jpg', slug: 'fortnite' },
];

export const topAppGames: Game[] = [
  { id: '5', title: 'Among Us', category: 'Party', image_url: '/games/amongus.jpg', slug: 'among-us' },
  { id: '6', title: 'Clash Royale', category: 'Stratégie', image_url: '/games/clashroyale.jpg', slug: 'clash-royale' },
  { id: '7', title: 'Subway Surfers', category: 'Arcade', image_url: '/games/subwaysurfers.jpg', slug: 'subway-surfers' },
  { id: '8', title: 'EA Sports FC Mobile', category: 'Sport', image_url: '/games/eafc.jpg', slug: 'ea-sports-fc-mobile' },
];