'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getUserIdentifier } from '@/lib/getUserIdentifier';

type GameWithVotes = {
  id: number;
  title: string;
  votes: number;
};

export default function BestGamesChart() {
  const [games, setGames] = useState<GameWithVotes[]>([]);
  const [votedGameId, setVotedGameId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const { data: allGames } = await supabase.from('games').select('id, title');
    const { data: allVotes } = await supabase.from('votes').select('game_id, user_identifier');

    if (!allGames || !allVotes) {
      setLoading(false);
      return;
    }

    const counts: Record<number, number> = {};
    allVotes.forEach((v) => {
      counts[v.game_id] = (counts[v.game_id] ?? 0) + 1;
    });

    const ranked = allGames
      .map((g) => ({ id: g.id, title: g.title, votes: counts[g.id] ?? 0 }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 4);

    setGames(ranked);

    const userId = getUserIdentifier();
    const myVote = allVotes.find((v) => v.user_identifier === userId);
    setVotedGameId(myVote ? myVote.game_id : null);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleVote = async (gameId: number) => {
    if (votedGameId !== null) return;

    const userId = getUserIdentifier();
    const { error } = await supabase
      .from('votes')
      .insert({ game_id: gameId, user_identifier: userId });

    if (!error) {
      setVotedGameId(gameId);
      loadData();
    }
  };

  if (loading || games.length === 0) return null;

  const maxVotes = Math.max(...games.map((g) => g.votes), 1);

  return (
    <section className="best-games">
      <h2>Meilleur jeu 2026 selon vous</h2>
      <div className="best-games-chart">
        {games.map((game) => (
          <div key={game.id} className="best-games-column">
            <span className="best-games-count">{game.votes}</span>
            <div
              className="best-games-bar"
              style={{ height: `${(game.votes / maxVotes) * 140 + 10}px` }}
            />
            <button
              className={`best-games-name ${votedGameId === game.id ? 'best-games-name-voted' : ''}`}
              onClick={() => handleVote(game.id)}
              disabled={votedGameId !== null}
            >
              {game.title}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}