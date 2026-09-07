import { useMemo } from 'react';
import { useHanaStore } from '@/store/useHanaStore';
import { getRecommendations } from '@/utils/recommendations';
import contentData from '@/data/content.json';
import ExternalContentCard from '@/components/ExternalContentCard';
import type { ContentData, ContentItem } from '@/types';

const data = contentData as ContentData;

const allContent: ContentItem[] = [
  ...data.music,
  ...data.shorts,
  ...data.quran,
  ...data.duas,
  ...data.quotes,
  ...data.visuals,
  ...data.places,
];

export default function Discover() {
  const currentMood = useHanaStore((s) => s.currentMood);
  const preferences = useHanaStore((s) => s.preferences);
  const interactions = useHanaStore((s) => s.interactions);
  const hiddenIds = useHanaStore((s) => s.hiddenContentIds);

  const recs = useMemo(() => {
    return getRecommendations(
      allContent,
      currentMood,
      preferences,
      interactions,
      hiddenIds,
      20
    );
  }, [
    currentMood,
    preferences,
    interactions,
    hiddenIds,
  ]);

  const familiar = recs.slice(
    0,
    Math.floor(recs.length * 0.8)
  );

  const exploration = recs.slice(
    Math.floor(recs.length * 0.8)
  );

  return (
    <div className="px-5 pt-8 pb-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Discover
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="font-medium mb-3">For You</h2>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
            {familiar.slice(0, 6).map((item) => (
              <ExternalContentCard
                key={item.id}
                item={item}
                compact
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-medium mb-3">
            Outside Your Comfort Zone
          </h2>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
            {exploration.slice(0, 4).map((item) => (
              <ExternalContentCard
                key={item.id}
                item={item}
                compact
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-medium mb-3">
            All Recommendations
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {recs.slice(0, 8).map((item) => (
              <ExternalContentCard
                key={item.id}
                item={item}
                compact
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

