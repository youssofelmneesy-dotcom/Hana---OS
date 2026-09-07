import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHanaStore } from '@/store/useHanaStore';
import type { Mood } from '@/types';
import { getMoodEmoji, getMoodLabel } from '@/utils/helpers';

interface OnboardingProps {
  onComplete: () => void;
}

const wantsMoreOptions = [
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'peace', label: 'Peace', emoji: '🌊' },
  { id: 'prayer', label: 'Prayer', emoji: '🕊️' },
  { id: 'shorts', label: 'Short videos', emoji: '📹' },
  { id: 'pretty', label: 'Pretty things', emoji: '✨' },
  { id: 'random', label: 'Random stuff', emoji: '🎲' },
  { id: 'everything', label: 'A little bit of everything', emoji: '🌈' },
];

const feelOptions = [
  { id: 'calm', label: 'Calm' },
  { id: 'cozy', label: 'Cozy' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'dreamy', label: 'Dreamy' },
  { id: 'dark', label: 'Dark' },
  { id: 'playful', label: 'Playful' },
  { id: 'elegant', label: 'Elegant' },
];

const moodOptions: Mood[] = [
  'good',
  'calm',
  'tired',
  'excited',
  'sad',
  'overwhelmed',
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [wantsMore, setWantsMore] = useState<string[]>([]);
  const [feel, setFeel] = useState<string[]>([]);
  const [mood, setMood] = useState<Mood>('good');

  const setOnboarded = useHanaStore((s) => s.setOnboarded);

  const toggleWant = (id: string) => {
    setWantsMore((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleFeel = (id: string) => {
    setFeel((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleComplete = () => {
    setOnboarded({
      wantsMoreOf: wantsMore,
      feelPreference: feel,
      initialMood: mood,
    });

    onComplete();
  };

  const screens = [
    {
      title: 'Hi Hana.',
      subtitle: 'Welcome to your little corner of the internet.',
      body: (
        <div className="text-center space-y-4">
          <p
            className="text-lg"
            style={{ color: 'var(--text-muted)' }}
          >
            Let's make it yours.
          </p>
        </div>
      ),
    },
    {
      title: 'What do you want more of?',
      subtitle: 'Pick as many as you like.',
      body: (
        <div className="grid grid-cols-2 gap-3">
          {wantsMoreOptions.map((opt) => {
            const selected = wantsMore.includes(opt.id);

            return (
              <button
                key={opt.id}
                onClick={() => toggleWant(opt.id)}
                className={`hana-card p-4 text-left transition-all ${
                  selected
                    ? 'ring-2 ring-[var(--primary)]'
                    : ''
                }`}
              >
                <span className="text-2xl block mb-1">
                  {opt.emoji}
                </span>

                <span className="text-sm font-medium">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: 'What should this place feel like?',
      subtitle: 'Choose your vibe.',
      body: (
        <div className="grid grid-cols-2 gap-3">
          {feelOptions.map((opt) => {
            const selected = feel.includes(opt.id);

            return (
              <button
                key={opt.id}
                onClick={() => toggleFeel(opt.id)}
                className={`hana-card p-4 text-center transition-all ${
                  selected
                    ? 'ring-2 ring-[var(--primary)]'
                    : ''
                }`}
              >
                <span className="text-sm font-medium">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: 'Pick your current vibe.',
      subtitle: 'You can change this anytime.',
      body: (
        <div className="grid grid-cols-2 gap-3">
          {moodOptions.map((m) => {
            const selected = mood === m;

            return (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`hana-card p-4 text-center transition-all ${
                  selected
                    ? 'ring-2 ring-[var(--primary)]'
                    : ''
                }`}
              >
                <span className="text-2xl block mb-1">
                  {getMoodEmoji(m)}
                </span>

                <span className="text-sm font-medium">
                  {getMoodLabel(m)}
                </span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "That's enough for now.",
      subtitle: 'Your space is ready.',
      body: (
        <div className="text-center">
          <p
            className="text-lg mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            You can change everything later from Settings.
          </p>
        </div>
      ),
    },
  ];

  const current = screens[step];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="flex-1 flex flex-col px-6 pt-12 pb-8 max-w-md mx-auto w-full">
        <div className="flex gap-2 mb-8">
          {screens.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all"
              style={{
                backgroundColor:
                  i <= step
                    ? 'var(--primary)'
                    : 'var(--card-border)',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-2xl font-semibold mb-2">
              {current.title}
            </h2>

            <p
              className="mb-8"
              style={{ color: 'var(--text-muted)' }}
            >
              {current.subtitle}
            </p>

            <div className="flex-1">
              {current.body}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="hana-btn hana-btn-outline flex-1"
            >
              Back
            </button>
          )}

          <button
            onClick={() => {
              if (step < screens.length - 1) {
                setStep(step + 1);
              } else {
                handleComplete();
              }
            }}
            className="hana-btn flex-1"
          >
            {step === screens.length - 1
              ? "Let's go"
              : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

