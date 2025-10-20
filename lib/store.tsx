import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  getAllPredictionsRemote,
  insertPredictionRemote,
  upsertPredictionRemote,
} from '@/lib/repositories/predictions';
import { upsertUserRemote, getLeaderboardUsersRemote } from '@/lib/repositories/users';
import { insertVoteRemote } from '@/lib/repositories/votes';
import {
  usePrivy,
  useLoginWithOAuth,
  useLoginWithEmail,
  type LoginWithOAuthInput,
  type PrivyUser,
} from '@privy-io/expo';

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

  sendCode: (args: { email: string }) => Promise<any>;
  loginWithCode: (args: { email: string; code: string }) => Promise<PrivyUser | undefined>;
};

const StoreContext = createContext<Store | undefined>(undefined);

function randomAvatar(seed: number) {
  const avatarIndex = (seed % 70) + 1;
  return `https://i.pravatar.cc/150?img=${avatarIndex}`;
}





export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [leaderboard, setLeaderboard] = useState<Store['leaderboard']>({ today: [], week: [], all: [] });

  const { user: privyUser, isReady, logout: privyLogout } = usePrivy();

  const oauth = useLoginWithOAuth({
    onError: (err: any) => {
      console.log('OAuth error', err);
    },
    onSuccess: (authUser) => {
      console.log('OAuth success', authUser);
      const accounts = (authUser as any)?.linked_accounts || (authUser as any)?.linkedAccounts || [];
      const tw = accounts.find((s: any) => String(s?.type || s?.platform || '').includes('twitter'));

      const twitterHandle = (() => {
        try {
          if (tw?.username) return `@${tw.username}`;
          if (tw?.handle) return `@${tw.handle}`;
          return '@twitter';
        } catch {
          return '@twitter';
        }
      })();
      const avatarUrl = (() => {
        try {
          return tw?.profilePictureUrl || tw?.avatarUrl || randomAvatar(9);
        } catch {
          return randomAvatar(9);
        }
      })();

      const mapped: User = {
        id: String((authUser as any)?.id || (authUser as any)?._id || Math.random().toString(36).slice(2, 9)),
        username: (tw?.username || (authUser as any)?.displayName || (authUser as any)?.nickname || 'Panda') as string,
        twitter: twitterHandle,
        avatar: avatarUrl,
        stats: { votes: 0, accuracy: 0, winnings: 0 },
      };

      upsertUserRemote(mapped).catch((e) => console.log('Error upserting user', e));
    },
  });

  const { loginWithCode, sendCode } = useLoginWithEmail({
    onError: (err: any) => {
      console.log('OAuth error', err);
    },
    onLoginSuccess: (authUser) => {
      console.log('Login success', authUser);

      const accounts = (authUser as any)?.linked_accounts || (authUser as any)?.linkedAccounts || [];
      const tw = accounts.find((s: any) => String(s?.type || s?.platform || '').includes('twitter'));

      const twitterHandle = (() => {
        try {
          if (tw?.username) return `@${tw.username}`;
          if (tw?.handle) return `@${tw.handle}`;
          return '@twitter';
        } catch {
          return '@twitter';
        }
      })();
      const avatarUrl = (() => {
        try {
          return tw?.profilePictureUrl || tw?.avatarUrl || randomAvatar(9);
        } catch {
          return randomAvatar(9);
        }
      })();

      const mapped: User = {
        id: String((authUser as any)?.id || (authUser as any)?._id || Math.random().toString(36).slice(2, 9)),
        username: (tw?.username || (authUser as any)?.displayName || (authUser as any)?.nickname || 'Panda') as string,
        twitter: twitterHandle,
        avatar: avatarUrl,
        stats: { votes: 0, accuracy: 0, winnings: 0 },
      };

      upsertUserRemote(mapped).catch((e) => console.log('Error upserting user', e));
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const remote = await getAllPredictionsRemote();
        setPredictions(remote ?? []);
      } catch {
        setPredictions([]);
      }
      try {
        const lb = await getLeaderboardUsersRemote();
        if (lb) {
          setLeaderboard({ today: lb, week: lb, all: lb });
        }
      } catch {}
    })();
  }, []);

  // When Privy is ready and has a user, sync to our store and route to home
  useEffect(() => {
    if (!isReady) return;
    if (privyUser) {
      const twitter = (() => {
        try {
          const social =
            (privyUser as any)?.socialAccounts || (privyUser as any)?.linkedAccounts || [];
          const tw = social.find((s: any) => (s?.platform || s?.type) === 'twitter');
          if (tw?.username) return `@${tw.username}`;
          if (tw?.handle) return `@${tw.handle}`;
          return '@twitter';
        } catch {
          return '@twitter';
        }
      })();
      const avatar = (() => {
        try {
          const social =
            (privyUser as any)?.socialAccounts || (privyUser as any)?.linkedAccounts || [];
          const tw = social.find((s: any) => (s?.platform || s?.type) === 'twitter');
          return tw?.profilePictureUrl || tw?.avatarUrl || randomAvatar(9);
        } catch {
          return randomAvatar(9);
        }
      })();
      const mapped: User = {
        id: String(
          (privyUser as any)?.id ||
            (privyUser as any)?._id ||
            Math.random().toString(36).slice(2, 9)
        ),
        username: (privyUser as any)?.displayName || (privyUser as any)?.nickname || 'Panda',
        twitter,
        avatar,
        stats: { votes: 0, accuracy: 0, winnings: 0 },
      };
      setUser(mapped);
      // Persist user profile to Supabase for analytics/relations
      // upsertUserRemote(mapped).catch(() => {});
      router.replace('/(tabs)/home');
    }
  }, [isReady, privyUser]);

  const loginWithTwitter = useCallback(() => {
    try {
      oauth.login({ provider: 'twitter' } as LoginWithOAuthInput);
    } catch (e) {
      console.log('Twitter login error', e);
    }
  }, [oauth]);

  const logout = useCallback(() => {
    try {
      privyLogout?.();
    } catch {}
    setUser(null);
    router.replace('/(auth)/landing');
  }, [privyLogout]);

  const addPrediction = useCallback((p: Prediction) => {
    setPredictions((prev) => [p, ...prev]);
    insertPredictionRemote(p).catch(() => {});
  }, []);

  const voteOnPrediction = useCallback((predictionId: string, optionId: string, amount: number) => {
    let updated: Prediction | null = null;
    setPredictions((prev) =>
      prev.map((p) => {
        if (p.id !== predictionId) return p;
        const options = p.options.map((o) =>
          o.id === optionId ? { ...o, votes: o.votes + 1 } : o
        );
        updated = {
          ...p,
          votes: p.votes + 1,
          pool: Math.round((p.pool + amount) * 100) / 100,
          options,
        };
        return updated;
      })
    );
    if (updated) {
      upsertPredictionRemote(updated).catch(() => {});
      try {
        const optIndex = updated.options.findIndex((o) => o.id === optionId);
        if (optIndex >= 0 && user?.id) {
          insertVoteRemote({ predictionId, userId: user.id, optionIndex: optIndex, amount }).catch(() => {});
        }
      } catch {}
      if (user) {
        setUser({ ...user, stats: { ...user.stats, votes: (user.stats.votes || 0) + 1 } });
      }
    }
  }, [setUser, user]);

  const addComment = useCallback((predictionId: string, comment: Comment) => {
    let updated: Prediction | null = null;
    setPredictions((prev) =>
      prev.map((p) => {
        if (p.id !== predictionId) return p;
        updated = { ...p, comments: [comment, ...p.comments] };
        return updated;
      })
    );
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
      sendCode,
      loginWithCode,
    }),
    [
      user,
      loginWithTwitter,
      logout,
      predictions,
      addPrediction,
      voteOnPrediction,
      addComment,
      leaderboard,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
