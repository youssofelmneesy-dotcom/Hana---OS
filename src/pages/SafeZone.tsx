import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wind,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useHanaStore } from '@/store/useHanaStore';
import {
  getComfortMix,
} from '@/utils/recommendations';
import contentData from '@/data/content.json';
import ExternalContentCard from '@/components/ExternalContentCard';
import type {
  ContentData,
  ContentItem,
} from '@/types';

const data = contentData as ContentData;

const allContent: ContentItem[] = [
  ...data.music,
  ...data.shorts,
  ...data.quran,
  ...data.duas,
  ...data.quotes,
  ...data.visuals,
];

export default function SafeZone() {
  const currentMood = useHanaStore(
    (s) => s.currentMood
  );

  const preferences = useHanaStore(
    (s) => s.preferences
  );

  const interactions = useHanaStore(
    (s) => s.interactions
  );

  const hiddenIds = useHanaStore(
    (s) => s.hiddenContentIds
  );

  const [breathing, setBreathing] =
    useState(false);

  const comfortMix = getComfortMix(
    allContent,
    currentMood,
    preferences,
    interactions,
    hiddenIds
  );

  return (
    <div className="px-5 pt-8 pb-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-2">
        Her Safe Zone
      </h1>

      <p
        className="mb-6"
        style={{ color: 'var(--text-muted)' }}
      >
        Let's make today a little lighter.
      </p>

      <section className="mb-8">
        <h2 className="font-medium mb-4 flex items-center gap-2">
          <Wind size={18} />
          Calm Down
        </h2>

        <div
          className="hana-card p-8 flex flex-col items-center justify-center min-h-[200px] cursor-pointer"
          onClick={() =>
            setBreathing(!breathing)
          }
        >
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              backgroundColor:
                'var(--primary)',
              opacity: 0.3,
            }}
            animate={
              breathing
                ? {
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.15, 0.3],
                  }
                : {}
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="text-2xl">
              🌬️
            </span>
          </motion.div>

          <p
            className="mt-4 text-sm"
            style={{
              color: 'var(--text-muted)',
            }}
          >
            {breathing
              ? 'Breathe with the circle...'
              : 'Tap to start breathing'}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-medium mb-3 flex items-center gap-2">
          <Sparkles size={18} />
          Tonight's Little Mix
        </h2>

        <div className="space-y-3">
          {comfortMix.map((item) => (
            <ExternalContentCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-3 flex items-center gap-2">
          <Heart size={18} />
          Positive Energy
        </h2>

        <div className="hana-card p-4 space-y-3">
          {data.quotes
            .slice(0, 3)
            .map((quote) => (
              <div
                key={quote.id}
                className="border-l-2 pl-3"
                style={{
                  borderColor:
                    'var(--primary)',
                }}
              >
                <p className="text-sm italic">
                  {quote.description}
                </p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

