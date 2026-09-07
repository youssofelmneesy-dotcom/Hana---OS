import { useHanaStore } from '@/store/useHanaStore';
import type { AestheticTheme } from '@/types';

const colors = [
  '#c4a77d',
  '#e8b4b8',
  '#a8d8ea',
  '#b8e0d2',
  '#d4a5a5',
  '#9b8aa5',
  '#f4d03f',
  '#5dade2',
  '#48c9b0',
  '#ec7063',
];

const moods: AestheticTheme['mood'][] = [
  'calm',
  'dreamy',
  'cozy',
  'elegant',
  'minimal',
  'dark',
  'playful',
  'modern',
  'colorful',
  'natural',
];

const speeds: AestheticTheme['animationSpeed'][] = [
  'subtle',
  'normal',
  'lively',
];

const backgrounds: AestheticTheme['backgroundType'][] = [
  'solid',
  'gradient',
  'texture',
  'visual',
];

const cards: AestheticTheme['cardStyle'][] = [
  'flat',
  'soft',
  'glass',
  'rounded',
  'sharp',
];

export default function MyAesthetic() {
  const aesthetic = useHanaStore((s) => s.aesthetic);
  const updateAesthetic = useHanaStore(
    (s) => s.updateAesthetic
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        My Aesthetic
      </h2>

      <p
        className="text-sm mb-6"
        style={{ color: 'var(--text-muted)' }}
      >
        Let's make this place feel like you.
      </p>

      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-medium mb-3">
            Primary Color
          </h3>

          <div className="flex gap-2 flex-wrap">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() =>
                  updateAesthetic({
                    primaryColor: c,
                  })
                }
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  aesthetic.primaryColor === c
                    ? 'scale-110'
                    : ''
                }`}
                style={{
                  backgroundColor: c,
                  borderColor:
                    aesthetic.primaryColor === c
                      ? 'var(--text)'
                      : 'transparent',
                }}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium mb-3">
            Mood
          </h3>

          <div className="flex gap-2 flex-wrap">
            {moods.map((m) => {
              const selected = aesthetic.mood === m;

              return (
                <button
                  key={m}
                  onClick={() =>
                    updateAesthetic({ mood: m })
                  }
                  className={`hana-card px-3 py-2 text-xs capitalize ${
                    selected
                      ? 'ring-2 ring-[var(--primary)]'
                      : ''
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium mb-3">
            Background
          </h3>

          <div className="flex gap-2">
            {backgrounds.map((b) => {
              const selected =
                aesthetic.backgroundType === b;

              return (
                <button
                  key={b}
                  onClick={() =>
                    updateAesthetic({
                      backgroundType: b,
                    })
                  }
                  className={`hana-card px-3 py-2 text-xs capitalize ${
                    selected
                      ? 'ring-2 ring-[var(--primary)]'
                      : ''
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium mb-3">
            Card Style
          </h3>

          <div className="flex gap-2 flex-wrap">
            {cards.map((c) => {
              const selected =
                aesthetic.cardStyle === c;

              return (
                <button
                  key={c}
                  onClick={() =>
                    updateAesthetic({
                      cardStyle: c,
                    })
                  }
                  className={`hana-card px-3 py-2 text-xs capitalize ${
                    selected
                      ? 'ring-2 ring-[var(--primary)]'
                      : ''
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium mb-3">
            Animation Speed
          </h3>

          <div className="flex gap-2">
            {speeds.map((s) => {
              const selected =
                aesthetic.animationSpeed === s;

              return (
                <button
                  key={s}
                  onClick={() =>
                    updateAesthetic({
                      animationSpeed: s,
                    })
                  }
                  className={`hana-card px-3 py-2 text-xs capitalize ${
                    selected
                      ? 'ring-2 ring-[var(--primary)]'
                      : ''
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

