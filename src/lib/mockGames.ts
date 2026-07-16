export type Game = {
  id: string;
  title: string;
  category: string;
  image: string;
  slug: string;
};

export const topPcGames: Game[] = [
  { id: '1', title: 'Minecraft', category: 'Aventure', image: '/games/minecraft.jpg', slug: 'minecraft' },
  { id: '2', title: 'Valorant', category: 'FPS', image: '/games/valorant.jpg', slug: 'valorant' },
  { id: '3', title: 'League of Legends', category: 'MOBA', image: '/games/lol.jpg', slug: 'league-of-legends' },
  { id: '4', title: 'Fortnite', category: 'Battle Royale', image: '/games/fortnite.jpg', slug: 'fortnite' },
];

export const topAppGames: Game[] = [
  { id: '5', title: 'Among Us', category: 'Party', image: '/games/amongus.jpg', slug: 'among-us' },
  { id: '6', title: 'Clash Royale', category: 'Stratégie', image: '/games/clashroyale.jpg', slug: 'clash-royale' },
  { id: '7', title: 'Subway Surfers', category: 'Arcade', image: '/games/subwaysurfers.jpg', slug: 'subway-surfers' },
  { id: '8', title: 'EA Sports FC Mobile', category: 'Sport', image: '/games/eafc.jpg', slug: 'ea-sports-fc-mobile' },
];