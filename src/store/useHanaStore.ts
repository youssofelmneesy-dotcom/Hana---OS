import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Mood, AestheticTheme, Interaction, FavoriteItem, ContentItem } from '@/types';

const defaultAesthetic: AestheticTheme = {
  primaryColor: '#c4a77d',
  accentColor: '#8b7355',
  backgroundTone: 'dark',
  mood: 'calm',
  visualIntensity: 'balanced',
  animationSpeed: 'normal',
  backgroundType: 'gradient',
  typography: 'clean',
  cardStyle: 'soft',
  navigationStyle: 'floating',
};

const defaultPreferences = {
  artists: {
    'Lege-Cy': 9,
    'Marwan Pablo': 8,
    'Amir Eid': 7,
    'Cairokee': 7,
    'Drake': 6,
    'Abyusif': 7,
    'Shehab': 6,
    'Teefo': 6,
  },
  moods: {},
  contentTypes: {
    music: 8,
    short: 7,
    quran: 6,
    dua: 5,
  },
  tags: {
    rap: 8,
    egyptian: 7,
    chill: 6,
    peaceful: 7,
  },
  languages: {
    arabic: 8,
    english: 6,
  },
};

const initialState: AppState = {
  version: 1,
  hasOnboarded: false,
  profile: {
    name: 'Hana',
    onboardingAnswers: {
      wantsMoreOf: [],
      feelPreference: [],
      initialMood: 'good',
    },
  },
  currentMood: null,
  moodHistory: [],
  preferences: defaultPreferences,
  favorites: [],
  aesthetic: defaultAesthetic,
  interactions: [],
  hiddenContentIds: [],
  settings: {
    prayerTrackerEnabled: false,
    prayerTracker: {},
    reducedMotion: false,
    showEasterEggs: true,
    easterEggsFound: [],
  },
};

interface HanaStore extends AppState {
  setOnboarded: (answers: AppState['profile']['onboardingAnswers']) => void;
  setMood: (mood: Mood) => void;
  toggleFavorite: (item: ContentItem) => void;
  removeFavorite: (id: string) => void;
  addInteraction: (interaction: Omit<Interaction, 'id' | 'timestamp'>) => void;
  hideContent: (id: string) => void;
  updateAesthetic: (aesthetic: Partial<AestheticTheme>) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  togglePrayerTracker: () => void;
  markPrayer: (prayer: string, done: boolean) => void;
  findEasterEgg: (eggId: string) => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  resetAll: () => void;
  updatePreference: (category: keyof AppState['preferences'], key: string, delta: number) => void;
}

export const useHanaStore = create<HanaStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setOnboarded: (answers) =>
        set({
          hasOnboarded: true,
          profile: { ...get().profile, onboardingAnswers: answers },
          currentMood: answers.initialMood,
          moodHistory: [{ mood: answers.initialMood, timestamp: new Date().toISOString() }],
        }),

      setMood: (mood) =>
        set({
          currentMood: mood,
          moodHistory: [...get().moodHistory, { mood, timestamp: new Date().toISOString() }].slice(-50),
        }),

      toggleFavorite: (item) => {
        const favorites = get().favorites;
        const exists = favorites.find((f) => f.id === item.id);
        if (exists) {
          set({ favorites: favorites.filter((f) => f.id !== item.id) });
        } else {
          const favorite: FavoriteItem = {
            ...item,
            savedAt: new Date().toISOString(),
          };
          set({ favorites: [...favorites, favorite] });
        }
      },

      removeFavorite: (id) =>
        set({ favorites: get().favorites.filter((f) => f.id !== id) }),

      addInteraction: (interaction) => {
        const newInteraction: Interaction = {
          ...interaction,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
        };
        set({ interactions: [...get().interactions, newInteraction].slice(-200) });
      },

      hideContent: (id) =>
        set({ hiddenContentIds: [...get().hiddenContentIds, id] }),

      updateAesthetic: (aesthetic) =>
        set({ aesthetic: { ...get().aesthetic, ...aesthetic } }),

      updateSettings: (settings) =>
        set({ settings: { ...get().settings, ...settings } }),

      togglePrayerTracker: () =>
        set({
          settings: {
            ...get().settings,
            prayerTrackerEnabled: !get().settings.prayerTrackerEnabled,
          },
        }),

      markPrayer: (prayer, done) =>
        set({
          settings: {
            ...get().settings,
            prayerTracker: { ...get().settings.prayerTracker, [prayer]: done },
          },
        }),

      findEasterEgg: (eggId) => {
        if (!get().settings.easterEggsFound.includes(eggId)) {
          set({
            settings: {
              ...get().settings,
              easterEggsFound: [...get().settings.easterEggsFound, eggId],
            },
          });
        }
      },

      exportData: () => JSON.stringify(get(), null, 2),

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.version && parsed.profile) {
            set({ ...parsed });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      resetAll: () => set(initialState),

      updatePreference: (category, key, delta) => {
        const prefs = get().preferences;
        const current = prefs[category][key] || 5;
        const updated = { ...prefs[category], [key]: Math.max(0, Math.min(10, current + delta)) };
        set({ preferences: { ...prefs, [category]: updated } });
      },
    }),
    {
      name: 'hana-os-state',
      version: 1,
    }
  )
);
