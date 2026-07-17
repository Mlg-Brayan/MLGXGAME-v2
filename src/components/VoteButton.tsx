'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getUserIdentifier } from '@/lib/getUserIdentifier';

export default function VoteButton({ gameId }: { gameId: number }) {
  const [voteCount, setVoteCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVotes() {
      const { count } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('game_id', gameId);

      setVoteCount(count ?? 0);

      const userId = getUserIdentifier();
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('game_id', gameId)
        .eq('user_identifier', userId)
        .maybeSingle();

      setHasVoted(!!existingVote);
      setLoading(false);
    }

    loadVotes();
  }, [gameId]);

  const handleVote = async () => {
    if (hasVoted) return;

    const userId = getUserIdentifier();
    const { error } = await supabase
      .from('votes')
      .insert({ game_id: gameId, user_identifier: userId });

    if (!error) {
      setHasVoted(true);
      setVoteCount((prev) => prev + 1);
    }
  };

  if (loading) return null;

  return (
    <button
      className={`vote-btn ${hasVoted ? 'vote-btn-voted' : ''}`}
      onClick={handleVote}
      disabled={hasVoted}
    >
      ▲ {voteCount} {hasVoted ? 'Voté' : 'Voter'}
    </button>
  );
}