import contentData from '@/data/content.json';
import ExternalContentCard from '@/components/ExternalContentCard';
import type { ContentData } from '@/types';

const data = contentData as ContentData;

export default function MyWorld() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        My World
      </h2>

      <section className="mb-6">
        <h3 className="font-medium mb-3">
          Places
        </h3>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
          {data.places.map((place) => (
            <ExternalContentCard
              key={place.id}
              item={place}
              compact
            />
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="font-medium mb-3">
          Visuals
        </h3>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
          {data.visuals.map((visual) => (
            <ExternalContentCard
              key={visual.id}
              item={visual}
              compact
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-medium mb-3">
          Random
        </h3>

        <div className="space-y-3">
          {data.random.map((item) => (
            <div
              key={item.id}
              className="hana-card p-4"
            >
              <h4 className="font-medium mb-1">
                {item.title}
              </h4>

              <p
                className="text-sm"
                style={{
                  color: 'var(--text-muted)',
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

