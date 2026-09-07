export type Mood =
  | 'good'
  | 'okay'
  | 'tired'
  | 'sad'
  | 'overwhelmed'
  | 'excited'
  | 'calm'
  | 'bored'
  | 'energetic'
  | 'need-quiet'
  | 'need-distraction'
  | 'need-spiritual'
  | 'late-night';

export type ContentCategory =
  | 'music'
  | 'video'
  | 'quran'
  | 'dua'
  | 'adhkar'
  | 'reminder'
  | 'quote'
  | 'visual'
  | 'place'
  | 'random'
  | 'short';

export type ContentItem = {
  id: string;
  title: string;
  category: ContentCategory;
  artist?: string;
  reciter?: string;
  surah?: string;
  moods: Mood[];
  energy: number;
  language?: 'arabic' | 'english' | 'both';
  tags: string[];
  source: 'youtube' | 'spotify' | 'internal' | 'external';
  url?: string;
  embedUrl?: string;
  image?: string;
  description?: string;

  text?: string;
  translation?: string;
  repeat?: number;
  reference?: string;

  duaText?: string;
  duaTranslation?: string;
  duaSource?: string;
};


export type ContentData = {
  music: ContentItem[];
  quran: ContentItem[];
  duas: ContentItem[];
  adhkar: ContentItem[];
  reminders: ContentItem[];
  shorts: ContentItem[];
  quotes: ContentItem[];
  places: ContentItem[];
  visuals: ContentItem[];
  random: ContentItem[];
};

export type FavoriteItem = ContentItem & {
  savedAt: string;
  personalNote?: string;
  rating?: 'loved' | 'nice' | 'neutral' | 'hidden';
};

export type UserPreferences = {
  artists: Record<string, number>;
  moods: Record<string, number>;
  contentTypes: Record<string, number>;
  tags: Record<string, number>;
  languages: Record<string, number>;
};

export type AestheticTheme = {
  primaryColor: string;
  accentColor: string;
  backgroundTone: 'light' | 'dark' | 'auto';
  mood:
    | 'calm'
    | 'dreamy'
    | 'cozy'
    | 'elegant'
    | 'minimal'
    | 'dark'
    | 'playful'
    | 'modern'
    | 'colorful'
    | 'natural';
  visualIntensity: 'minimal' | 'balanced' | 'expressive';
  animationSpeed: 'subtle' | 'normal' | 'lively';
  backgroundType: 'solid' | 'gradient' | 'texture' | 'visual';
  typography: 'clean' | 'elegant' | 'playful';
  cardStyle: 'flat' | 'soft' | 'glass' | 'rounded' | 'sharp';
  navigationStyle: 'compact' | 'floating' | 'minimal';
};

export type Interaction = {
  id: string;
  contentId: string;
  action: 'open' | 'play' | 'save' | 'love' | 'skip' | 'hide' | 'rate';
  timestamp: string;
  rating?: 'loved' | 'nice' | 'neutral' | 'hidden';
};

export type AppState = {
  version: number;
  hasOnboarded: boolean;
  profile: {
    name: string;
    onboardingAnswers: {
      wantsMoreOf: string[];
      feelPreference: string[];
      initialMood: Mood;
    };
  };
  currentMood: Mood | null;
  moodHistory: { mood: Mood; timestamp: string }[];
  preferences: UserPreferences;
  favorites: FavoriteItem[];
  aesthetic: AestheticTheme;
  interactions: Interaction[];
  hiddenContentIds: string[];
  settings: {
    prayerTrackerEnabled: boolean;
    prayerTracker: Record<string, boolean>;
    reducedMotion: boolean;
    showEasterEggs: boolean;
    easterEggsFound: string[];
  };
};

export type Page = 'home' | 'discover' | 'safe' | 'pray' | 'me';

export type SubPage =
  | 'favorites'
  | 'aesthetic'
  | 'randomly'
  | 'world'
  | 'settings';

  