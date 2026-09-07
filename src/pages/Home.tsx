import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useHanaStore } from '@/store/useHanaStore';
import { useGreeting } from '@/hooks/useGreeting';
import {
  getHomeTagline,
  getFlirtyLine,
  getMoodEmoji,
  getMoodLabel,
} from '@/utils/helpers';
import { getRecommendations } from '@/utils/recommendations';
import contentData from '@/data/content.json';
import ExternalContentCard from '@/components/ExternalContentCard';
import type { ContentData, ContentItem, Mood, Page } from '@/types';

const data = contentData as ContentData;

const allContent: ContentItem[] = [
  ...data.music,
  ...data.shorts,
  ...data.quran,
  ...data.duas,
  ...data.quotes,
  ...data.visuals,
];

const moods: Mood[] = [
  'good',
  'okay',
  'tired',
  'sad',
  'overwhelmed',
  'excited',
  'calm',
  'bored',
  'energetic',
  'need-quiet',
  'need-distraction',
  'need-spiritual',
  'late-night',
];

function navigateTo(page: Page) {
  window.dispatchEvent(
    new CustomEvent<Page>('hana:navigate', {
      detail: page,
    })
  );
}

export default function Home() {
  const currentMood = useHanaStore((s) => s.currentMood);
  const preferences = useHanaStore((s) => s.preferences);
  const interactions = useHanaStore((s) => s.interactions);
  const hiddenIds = useHanaStore((s) => s.hiddenContentIds);
  const setMood = useHanaStore((s) => s.setMood);
  const greeting = useGreeting();

  const recommendations = useMemo(() => {
    return getRecommendations(
      allContent,
      currentMood,
      preferences,
      interactions,
      hiddenIds,
      6
    );
  }, [
    currentMood,
    preferences,
    interactions,
    hiddenIds,
  ]);

  const tagline = useMemo(() => getHomeTagline(), []);
  const flirty = useMemo(() => getFlirtyLine(), []);

  const quickAccess = [
    {
      category: 'Quran',
      title: 'A little peace for your heart',
      page: 'pray' as Page,
      accent: 'var(--primary)',
    },
    {
      category: 'Dua',
      title: 'Something to say when words feel hard',
      page: 'pray' as Page,
      accent: 'var(--accent)',
    },
    {
      category: 'Music',
      title: 'Something that sounds like your mood',
      page: 'discover' as Page,
      accent: 'var(--primary)',
    },
  ];

  return (
    <div className="px-5 pt-8 pb-8 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7"
      >
        <h1 className="text-2xl font-semibold mb-1">
          {greeting}
        </h1>

        <p style={{ color: 'var(--text-muted)' }}>
          {tagline}
        </p>
      </motion.div>

      {/* Mood */}
      <div className="mb-8">
        <h2
          className="text-sm font-medium mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          What do you need right now?
        </h2>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {moods.map((mood) => {
            const selected = currentMood === mood;

            return (
              <button
                key={mood}
                onClick={() => setMood(mood)}
                className={`hana-card px-4 py-3 flex flex-col items-center min-w-[78px] transition-all duration-300 ${
                  selected
                    ? 'ring-2 ring-[var(--primary)] scale-[1.02]'
                    : ''
                }`}
                style={{
                  backgroundColor: selected
                    ? 'var(--primary)'
                    : undefined,
                  color: selected
                    ? 'var(--bg)'
                    : undefined,
                }}
              >
                <span className="text-xl">
                  {getMoodEmoji(mood)}
                </span>

                <span className="text-xs mt-1 font-medium whitespace-nowrap">
                  {getMoodLabel(mood)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles
            size={16}
            style={{ color: 'var(--primary)' }}
          />

          <h2 className="font-medium">
            {flirty}
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
          {recommendations.map((item) => (
            <ExternalContentCard
              key={item.id}
              item={item}
              compact
            />
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">
            Quick Access
          </h2>
        </div>

        {quickAccess.map((item) => (
          <button
            key={item.category}
            type="button"
            onClick={() => navigateTo(item.page)}
            className="hana-card w-full p-4 text-left flex items-center justify-between gap-4 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
          >
            <div className="min-w-0">
              <p
                className="text-xs uppercase tracking-wider mb-1"
                style={{ color: item.accent }}
              >
                {item.category}
              </p>

              <p className="font-medium">
                {item.title}
              </p>
            </div>

            <ArrowRight
              size={18}
              className="flex-shrink-0"
              style={{ color: 'var(--text-muted)' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

