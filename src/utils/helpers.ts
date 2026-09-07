import type {
  ContentItem,
  Mood,
  UserPreferences,
  Interaction,
} from '@/types';

export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 22) return 'Good evening';

  return 'Late night';
}

export function getMoodEmoji(mood: Mood): string {
  const map: Record<Mood, string> = {
    good: '🌸',
    okay: '☁️',
    tired: '🌙',
    sad: '🌧️',
    overwhelmed: '🖤',
    excited: '✨',
    calm: '🌊',
    bored: '💤',
    energetic: '⚡',
    'need-quiet': '🌱',
    'need-distraction': '🎮',
    'need-spiritual': '🕊️',
    'late-night': '🌙',
  };

  return map[mood] || '✨';
}

export function getMoodLabel(mood: Mood): string {
  const map: Record<Mood, string> = {
    good: 'Good',
    okay: 'Okay',
    tired: 'Tired',
    sad: 'Sad',
    overwhelmed: 'Overwhelmed',
    excited: 'Excited',
    calm: 'Calm',
    bored: 'Bored',
    energetic: 'Energetic',
    'need-quiet': 'Need Quiet',
    'need-distraction': 'Need Distraction',
    'need-spiritual': 'Need Spiritual Comfort',
    'late-night': 'Late Night',
  };

  return map[mood] || mood;
}

export function getEnergyForMood(mood: Mood): number {
  const map: Record<Mood, number> = {
    good: 6,
    okay: 4,
    tired: 2,
    sad: 2,
    overwhelmed: 2,
    excited: 9,
    calm: 3,
    bored: 4,
    energetic: 9,
    'need-quiet': 1,
    'need-distraction': 5,
    'need-spiritual': 2,
    'late-night': 2,
  };

  return map[mood] || 5;
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    music: 'Music',
    video: 'Video',
    quran: 'Quran',
    dua: 'Dua',
    adhkar: 'Adhkar',
    reminder: 'Reminder',
    quote: 'Quote',
    visual: 'Visual',
    place: 'Place',
    random: 'Random',
    short: 'Short',
  };

  return map[category] || category;
}

export function getFlirtyLine(): string {
  const lines = [
    'Yes, this is suspiciously personalized.',
    "Don't ask how I knew that.",
    'Apparently someone knows your taste a little too well.',
    'Okay, this one is actually very you.',
    "You're allowed to skip this one. I won't tell.",
    'See? I told you this place would suit you.',
    'Someone spent way too much time making this.',
    "Don't get used to being this spoiled.",
    'You have excellent taste. Obviously.',
    'Fine. This one is for you.',
    'This place gets better the more you use it.',
    "We're still figuring out your taste.",
    'You can teach me.',
    'Tell me what you like.',
  ];

  return lines[Math.floor(Math.random() * lines.length)];
}

export function getHomeTagline(): string {
  const lines = [
    'Your space, your rules.',
    'Nothing to post. Nothing to prove.',
    'Just your space.',
    "Okay, what's the vibe today?",
    'Need peace or chaos?',
    'Music or reels?',
    'Something familiar or something new?',
    "Let's make today a little lighter.",
  ];

  return lines[Math.floor(Math.random() * lines.length)];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getThemeCSS(aesthetic: {
  primaryColor: string;
  accentColor: string;
  backgroundTone: string;
  cardStyle: string;
  animationSpeed: string;
}): Record<string, string> {
  const isLight = aesthetic.backgroundTone === 'light';

  const speedMap = {
    subtle: '0.3s',
    normal: '0.5s',
    lively: '0.7s',
  };

  let cardBg = isLight
    ? 'rgba(255,255,255,0.8)'
    : 'rgba(30,30,40,0.7)';

  let cardBorder = isLight
    ? 'rgba(0,0,0,0.05)'
    : 'rgba(255,255,255,0.05)';

  if (aesthetic.cardStyle === 'glass') {
    cardBg = isLight
      ? 'rgba(255,255,255,0.25)'
      : 'rgba(255,255,255,0.08)';

    cardBorder = isLight
      ? 'rgba(255,255,255,0.4)'
      : 'rgba(255,255,255,0.1)';
  } else if (aesthetic.cardStyle === 'flat') {
    cardBg = isLight ? '#ffffff' : '#1a1a2e';
    cardBorder = 'transparent';
  }

  return {
    '--primary': aesthetic.primaryColor,
    '--accent': aesthetic.accentColor,
    '--bg': isLight ? '#f5f0eb' : '#0f0f1a',
    '--bg-secondary': isLight ? '#ffffff' : '#1a1a2e',
    '--text': isLight ? '#1a1a2e' : '#e8e4dc',
    '--text-muted': isLight ? '#6b6b7b' : '#9a9aaa',
    '--card-bg': cardBg,
    '--card-border': cardBorder,
    '--radius':
      aesthetic.cardStyle === 'sharp'
        ? '4px'
        : aesthetic.cardStyle === 'rounded'
          ? '20px'
          : '14px',
    '--transition':
      speedMap[aesthetic.animationSpeed as keyof typeof speedMap] || '0.5s',
  };
}

