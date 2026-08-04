'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getUserIdentifier } from '@/lib/getUserIdentifier';

export default function VoteButton({ gameId }: { gameId: number }) {
  const [voteCount, setVoteCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadVotes = async () => {
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
  };

  useEffect(() => {
    loadVotes();
  }, [gameId]);

  const handleVote = async () => {
    const userId = getUserIdentifier();

    if (hasVoted) {
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('game_id', gameId)
        .eq('user_identifier', userId);

      if (!error) {
        setHasVoted(false);
        setVoteCount((prev) => prev - 1);
      }
      return;
    }

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
    >
      ▲ {voteCount} {hasVoted ? 'Voté (retirer)' : 'Voter'}
    </button>
  );
}