import { useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Hand,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Settings,
  Sun,
} from 'lucide-react';

import { useHanaStore } from '@/store/useHanaStore';
import contentData from '@/data/content.json';
import ExternalContentCard from '@/components/ExternalContentCard';

import type {
  ContentData,
  ContentItem,
} from '@/types';

const data = contentData as ContentData;

const prayers = [
  'Fajr',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Isha',
];

type RichItem = ContentItem & {
  text?: string;
  translation?: string;
  repeat?: number;
  reference?: string;
};

export default function Pray() {
  const [activeTab, setActiveTab] = useState<
    'quran' | 'dua' | 'adhkar' | 'tracker'
  >('quran');

  const [expandedDua, setExpandedDua] =
    useState<string | null>(null);

  const [adhkarProgress, setAdhkarProgress] =
    useState<Record<string, number>>({});

  const trackerEnabled = useHanaStore(
    (s) => s.settings.prayerTrackerEnabled
  );

  const prayerTracker = useHanaStore(
    (s) => s.settings.prayerTracker
  );

  const togglePrayerTracker = useHanaStore(
    (s) => s.togglePrayerTracker
  );

  const markPrayer = useHanaStore(
    (s) => s.markPrayer
  );

  const toggleFavorite = useHanaStore(
    (s) => s.toggleFavorite
  );

  const tabs = [
    {
      id: 'quran' as const,
      label: 'Quran',
      icon: BookOpen,
    },
    {
      id: 'dua' as const,
      label: 'Dua',
      icon: Hand,
    },
    {
      id: 'adhkar' as const,
      label: 'Adhkar',
      icon: Sun,
    },
  ];

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard can be unavailable in some browsers.
    }
  };

  const incrementDhikr = (
    item: RichItem
  ) => {
    const repeat = item.repeat ?? 1;
    const current =
      adhkarProgress[item.id] ?? 0;

    const next =
      current >= repeat ? 0 : current + 1;

    setAdhkarProgress((previous) => ({
      ...previous,
      [item.id]: next,
    }));
  };

  const resetDhikr = (
    event: React.MouseEvent,
    id: string
  ) => {
    event.stopPropagation();

    setAdhkarProgress((previous) => ({
      ...previous,
      [id]: 0,
    }));
  };

  return (
    <div className="px-5 pt-8 pb-8 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">
          Pray
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
          }}
        >
          A peaceful space for your heart.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected =
            activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(tab.id)
              }
              className={`hana-card px-4 py-2.5 flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-all ${
                selected
                  ? 'ring-2 ring-[var(--primary)]'
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
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() =>
            setActiveTab('tracker')
          }
          className={`hana-card px-4 py-2.5 flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === 'tracker'
              ? 'ring-2 ring-[var(--primary)]'
              : ''
          }`}
          style={{
            backgroundColor:
              activeTab === 'tracker'
                ? 'var(--primary)'
                : undefined,
            color:
              activeTab === 'tracker'
                ? 'var(--bg)'
                : undefined,
          }}
        >
          <Settings size={16} />
          Tracker
        </button>
      </div>

      {/* ================= QURAN ================= */}

      {activeTab === 'quran' && (
        <div className="space-y-4">
          <div className="hana-card p-4">
            <p
              className="text-xs uppercase tracking-wider mb-1"
              style={{
                color: 'var(--primary)',
              }}
            >
              Quran
            </p>

            <h2 className="font-medium">
              Abdul Basit Abdus-Samad
            </h2>

            <p
              className="text-sm mt-1"
              style={{
                color: 'var(--text-muted)',
              }}
            >
              Tap any card to listen inside Hana.
            </p>
          </div>

          {data.quran.map((item) => (
            <ExternalContentCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      )}

      {/* ================= DUA ================= */}

      {activeTab === 'dua' && (
        <div className="space-y-4">
          {data.duas.map((rawItem) => {
            const dua =
              rawItem as RichItem;

            const text =
              dua.text ??
              dua.duaText ??
              '';

            const translation =
              dua.translation ??
              dua.duaTranslation ??
              '';

            const expanded =
              expandedDua === dua.id;

            return (
              <div
                key={dua.id}
                className="hana-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedDua(
                      expanded
                        ? null
                        : dua.id
                    )
                  }
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p
                        className="text-xs uppercase tracking-wider mb-1"
                        style={{
                          color:
                            'var(--primary)',
                        }}
                      >
                        Dua
                      </p>

                      <h3 className="font-medium">
                        {dua.title}
                      </h3>
                    </div>

                    <span
                      className="text-xs"
                      style={{
                        color:
                          'var(--text-muted)',
                      }}
                    >
                      {expanded
                        ? 'Close'
                        : 'Read'}
                    </span>
                  </div>

                  <p className="text-xl leading-[2] text-right font-medium">
                    {text}
                  </p>

                  {expanded && (
                    <div className="mt-5 pt-4 border-t border-[var(--card-border)]">
                      {translation && (
                        <p
                          className="text-sm leading-7"
                          style={{
                            color:
                              'var(--text-muted)',
                          }}
                        >
                          {translation}
                        </p>
                      )}

                      {dua.duaSource && (
                        <p
                          className="text-xs mt-4"
                          style={{
                            color:
                              'var(--primary)',
                          }}
                        >
                          Source: {dua.duaSource}
                        </p>
                      )}

                      {dua.reference && (
                        <p
                          className="text-xs mt-1"
                          style={{
                            color:
                              'var(--text-muted)',
                          }}
                        >
                          {dua.reference}
                        </p>
                      )}
                    </div>
                  )}
                </button>

                <div className="px-5 pb-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        [
                          text,
                          translation,
                        ]
                          .filter(Boolean)
                          .join('\n\n')
                      )
                    }
                    className="hana-btn hana-btn-outline text-xs py-2.5 px-3 flex items-center gap-1.5"
                  >
                    <Copy size={13} />
                    Copy
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite(
                        dua as ContentItem
                      )
                    }
                    className="hana-btn text-xs py-2.5 px-3 flex items-center gap-1.5 flex-1 justify-center"
                  >
                    <Heart
                      size={13}
                    />
                    Save
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= ADHKAR ================= */}

      {activeTab === 'adhkar' && (
        <div className="space-y-4">
          {data.adhkar.map((rawItem) => {
            const item =
              rawItem as RichItem;

            const repeat =
              item.repeat ?? 1;

            const current =
              adhkarProgress[item.id] ?? 0;

            const text =
              item.text ??
              item.description ??
              '';

            const translation =
              item.translation ?? '';

            const percentage =
              Math.min(
                100,
                (current / repeat) * 100
              );

            const completed =
              current >= repeat;

            return (
              <div
                key={item.id}
                className={`hana-card overflow-hidden transition-all ${
                  completed
                    ? 'ring-1 ring-[var(--primary)]'
                    : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    incrementDhikr(item)
                  }
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p
                        className="text-xs uppercase tracking-wider mb-1"
                        style={{
                          color:
                            'var(--primary)',
                        }}
                      >
                        Adhkar
                      </p>

                      <h3 className="font-medium">
                        {item.title}
                      </h3>
                    </div>

                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          completed
                            ? 'var(--primary)'
                            : 'var(--bg-secondary)',
                      }}
                    >
                      {completed ? (
                        <Check
                          size={17}
                          style={{
                            color:
                              'var(--bg)',
                          }}
                        />
                      ) : (
                        <Plus
                          size={17}
                          style={{
                            color:
                              'var(--primary)',
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Full Arabic text */}
                  <p
                    className="text-lg leading-[2] text-right"
                    dir="rtl"
                  >
                    {text}
                  </p>

                  {/* Translation */}
                  {translation && (
                    <p
                      className="text-sm leading-6 mt-4"
                      style={{
                        color:
                          'var(--text-muted)',
                      }}
                    >
                      {translation}
                    </p>
                  )}

                  {/* Counter */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs"
                        style={{
                          color:
                            'var(--text-muted)',
                        }}
                      >
                        Tap to count
                      </span>

                      <span
                        className="text-sm font-medium"
                        style={{
                          color:
                            'var(--primary)',
                        }}
                      >
                        {current} / {repeat}
                      </span>
                    </div>

                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{
                        backgroundColor:
                          'var(--bg-secondary)',
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            'var(--primary)',
                        }}
                      />
                    </div>
                  </div>

                  {item.reference && (
                    <p
                      className="text-xs mt-4"
                      style={{
                        color:
                          'var(--text-muted)',
                      }}
                    >
                      {item.reference}
                    </p>
                  )}
                </button>

                <div className="px-5 pb-5 flex gap-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      copyText(text);
                    }}
                    className="hana-btn hana-btn-outline text-xs py-2.5 px-3 flex items-center gap-1.5"
                  >
                    <Copy size={13} />
                    Copy
                  </button>

                  <button
                    type="button"
                    onClick={(event) =>
                      resetDhikr(
                        event,
                        item.id
                      )
                    }
                    className="hana-btn hana-btn-outline text-xs py-2.5 px-3"
                    aria-label="Reset counter"
                  >
                    <RotateCcw size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite(
                        item as ContentItem
                      )
                    }
                    className="hana-btn text-xs py-2.5 px-3 flex items-center gap-1.5 flex-1 justify-center"
                  >
                    <Heart size={13} />
                    Save
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= TRACKER ================= */}

      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="hana-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-medium">
                  Prayer Tracker
                </h2>

                <p
                  className="text-sm mt-1"
                  style={{
                    color:
                      'var(--text-muted)',
                  }}
                >
                  Keep track of today's prayers.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  togglePrayerTracker
                }
                className={`relative w-12 h-7 rounded-full transition-all ${
                  trackerEnabled
                    ? 'bg-[var(--primary)]'
                    : 'bg-[var(--bg-secondary)]'
                }`}
                aria-label="Toggle prayer tracker"
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                    trackerEnabled
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {trackerEnabled && (
            <div className="space-y-2">
              {prayers.map((prayer) => {
                const done =
                  prayerTracker[prayer];

                return (
                  <button
                    key={prayer}
                    type="button"
                    onClick={() =>
                      markPrayer(
                        prayer,
                        !done
                      )
                    }
                    className="hana-card w-full p-4 flex items-center justify-between text-left"
                  >
                    <div>
                      <p className="font-medium">
                        {prayer}
                      </p>

                      <p
                        className="text-xs mt-1"
                        style={{
                          color:
                            'var(--text-muted)',
                        }}
                      >
                        {done
                          ? 'Completed'
                          : 'Not completed yet'}
                      </p>
                    </div>

                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          done
                            ? 'var(--primary)'
                            : 'var(--bg-secondary)',
                      }}
                    >
                      {done ? (
                        <Check
                          size={16}
                          style={{
                            color:
                              'var(--bg)',
                          }}
                        />
                      ) : (
                        <Minus
                          size={16}
                          style={{
                            color:
                              'var(--text-muted)',
                          }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

