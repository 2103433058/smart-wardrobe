import { create } from 'zustand';
import { openDB } from 'idb';
import type { UserProfile } from '../types';

const DB_NAME = 'fashion-wardrobe';
const STORE_NAME = 'profile';
const PROFILE_KEY = 'current';

function getProfileDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 2 && !db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

const defaultProfile: UserProfile = {
  body: {
    shape: 'rectangle',
    heightRange: 'average',
    highlightAreas: [],
    downplayAreas: [],
  },
  color: {
    skinTone: 'neutral',
    hairColor: '',
    avoidColors: [],
  },
  styleProfile: {
    primaryStyle: 'minimalist',
    secondaryStyle: 'elegant',
    styleScores: {} as Record<string, number>,
  },
  lifestyle: {
    workEnv: '',
    weekendActivity: '',
    topOccasions: [],
    budget: 'mid',
  },
  preferences: {
    patternPreference: [],
    fitPreference: 'regular',
    accessoryLevel: 'minimal',
  },
};

interface ProfileState {
  profile: UserProfile;
  loading: boolean;
  hasProfile: boolean;
  loadProfile: () => Promise<void>;
  setProfile: (profile: UserProfile) => Promise<void>;
  updateProfile: (partial: Partial<UserProfile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: { ...defaultProfile },
  loading: false,
  hasProfile: false,

  loadProfile: async () => {
    set({ loading: true });
    try {
      const db = await getProfileDB();
      const saved = await db.get(STORE_NAME, PROFILE_KEY);
      if (saved) {
        set({ profile: saved as UserProfile, hasProfile: true });
      }
    } catch { /* first visit, use defaults */ }
    set({ loading: false });
  },

  setProfile: async (profile) => {
    const db = await getProfileDB();
    await db.put(STORE_NAME, profile, PROFILE_KEY);
    set({ profile, hasProfile: true });
  },

  updateProfile: async (partial) => {
    const current = get().profile;
    const merged = { ...current, ...partial };
    await get().setProfile(merged);
  },
}));
