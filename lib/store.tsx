import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { getAllPredictionsRemote, insertPredictionRemote, upsertPredictionRemote } from '@/lib/repositories/predictions';

export type User = {
  id: string;
  username: string;
  twitter: string;
  avatar: string;
  stats: {
    votes: number;
    accuracy: number; // percentage 0-100
    winnings: number; // USDC amount
  };
};

export type Comment = {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  text: string;
  timestamp: number; // epoch ms
};

export type PredictionOption = {
  id: string;
  label: string;
  image?: string | null;
  votes: number;
};

export type Prediction = {
  id: string;
  title: string;
  thumbnail?: string | null;
  votes: number;
  pool: number; // in USDC
  comments: Comment[];
  options: PredictionOption[];
  duration: number; // milliseconds remaining
  createdAt: string; // ISO string
  author: {
    username: string;
    avatar: string;
    twitter: string;
  };
  topVoters: { avatar: string }[];
};

export type LeaderboardEntry = {
  id: string;
  username: string;
  avatar: string;
  score: number; // points/winnings
};

export type Store = {
  user: User | null;
  setUser: (u: User | null) => void;
  loginWithTwitter: () => void;
  logout: () => void;

  predictions: Prediction[];
  setPredictions: (p: Prediction[]) => void;
  addPrediction: (p: Prediction) => void;
  voteOnPrediction: (predictionId: string, optionId: string, amount: number) => void;
  addComment: (predictionId: string, comment: Comment) => void;

  leaderboard: {
    today: LeaderboardEntry[];
    week: LeaderboardEntry[];
    all: LeaderboardEntry[];
  };
};

const StoreContext = createContext<Store | undefined>(undefined);

function randomAvatar(seed: number) {
  // Use pravatar as placeholder avatars
  const n = (seed % 70) + 1;
  return `https://i.pravatar.cc/150?img=${n}`;
}

function now() {
  return Date.now();
}

function initialPredictions(): Prediction[] {
  const baseAuthor = {
    username: 'crypto_panda',
    avatar: randomAvatar(5),
    twitter: '@crypto_panda',
  };
  return [
    {
      id: '1',
      title: 'Will BTC hit $75k by end of week?',
      thumbnail:
        'https://images.unsplash.com/photo-1621416894569-0e2e6b2b9b1f?q=80&w=1400&auto=format&fit=crop',
      votes: 123,
      pool: 250.5,
      comments: [
        {
          id: 'c1',
          user: { username: 'satoshi', avatar: randomAvatar(10) },
          text: "I'm bullish!",
          timestamp: now() - 1000 * 60 * 60 * 2,
        },
        {
          id: 'c2',
          user: { username: 'bear', avatar: randomAvatar(22) },
          text: 'Too much resistance...',
          timestamp: now() - 1000 * 60 * 45,
        },
      ],
      options: [
        { id: 'o1', label: 'Yes', votes: 70 },
        { id: 'o2', label: 'No', votes: 53 },
      ],
      duration: 1000 * 60 * 60 * 36, // 36 hours
      createdAt: new Date(now() - 1000 * 60 * 60 * 12).toISOString(), // created 12h ago
      author: baseAuthor,
      topVoters: [{ avatar: randomAvatar(1) }, { avatar: randomAvatar(2) }, { avatar: randomAvatar(3) }],
    },
    {
      id: '2',
      title: 'Will ETH gas average < 20 gwei tomorrow?',
      thumbnail:
        'https://images.unsplash.com/photo-1640340434850-820bdfc9b6bf?q=80&w=1400&auto=format&fit=crop',
      votes: 89,
      pool: 110.2,
      comments: [],
      options: [
        { id: 'o1', label: 'Yes', votes: 34 },
        { id: 'o2', label: 'No', votes: 55 },
      ],
      duration: 1000 * 60 * 60 * 24, // 24h
      createdAt: new Date(now() - 1000 * 60 * 30).toISOString(), // 30m ago
      author: {
        username: 'dev_guru',
        avatar: randomAvatar(14),
        twitter: '@dev_guru',
      },
      topVoters: [{ avatar: randomAvatar(4) }, { avatar: randomAvatar(5) }],
    },
  ];
}

function initialLeaderboard(): Store['leaderboard'] {
  const make = (offset: number) =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: `${offset}-${i}`,
      username: `user_${offset}_${i + 1}`,
      avatar: randomAvatar(offset * 7 + i),
      score: Math.floor(Math.random() * 1000 + (20 - i) * 50),
    }));
  return {
    today: make(1).sort((a, b) => b.score - a.score),
    week: make(2).sort((a, b) => b.score - a.score),
    all: make(3).sort((a, b) => b.score - a.score),
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [leaderboard] = useState(initialLeaderboard());

  useEffect(() => {
    async function load() {
      try {
        const remote = await getAllPredictionsRemote();
        if (remote && remote.length > 0) {
          setPredictions(remote);
          return;
        }
      } catch (e) {
        // ignore
      }
      const seed = initialPredictions();
      setPredictions(seed);
    }
    load();
  }, []);

  const loginWithTwitter = useCallback(() => {
    const mock: User = {
      id: 'u1',
      username: 'Panda',
      twitter: '@panda',
      avatar: randomAvatar(9),
      stats: { votes: 42, accuracy: 74, winnings: 128.5 },
    };
    setUser(mock);
    router.replace('/(tabs)/home');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    router.replace('/(auth)/landing');
  }, []);

  const addPrediction = useCallback((p: Prediction) => {
    setPredictions(prev => [p, ...prev]);
    insertPredictionRemote(p).catch(() => {});
  }, []);

  const voteOnPrediction = useCallback(
    (predictionId: string, optionId: string, amount: number) => {
      let updated: Prediction | null = null;
      setPredictions(prev =>
        prev.map(p => {
          if (p.id !== predictionId) return p;
          const options = p.options.map(o => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o));
          updated = {
            ...p,
            votes: p.votes + 1,
            pool: Math.round((p.pool + amount) * 100) / 100,
            options,
          };
          return updated;
        })
      );
      if (updated) upsertPredictionRemote(updated).catch(() => {});
    },
    []
  );

  const addComment = useCallback((predictionId: string, comment: Comment) => {
    let updated: Prediction | null = null;
    setPredictions(prev => prev.map(p => {
      if (p.id !== predictionId) return p;
      updated = { ...p, comments: [comment, ...p.comments] };
      return updated;
    }));
    if (updated) upsertPredictionRemote(updated).catch(() => {});
  }, []);

  const value = useMemo<Store>(
    () => ({
      user,
      setUser,
      loginWithTwitter,
      logout,
      predictions,
      setPredictions,
      addPrediction,
      voteOnPrediction,
      addComment,
      leaderboard,
    }),
    [user, loginWithTwitter, logout, predictions, addPrediction, voteOnPrediction, addComment, leaderboard]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
