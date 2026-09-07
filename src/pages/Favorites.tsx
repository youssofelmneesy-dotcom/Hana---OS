import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2 } from 'lucide-react';
import { useHanaStore } from '@/store/useHanaStore';
import { getCategoryLabel } from '@/utils/helpers';
import type { ContentCategory } from '@/types';

export default function Favorites() {
  const favorites = useHanaStore((s) => s.favorites);
  const removeFavorite = useHanaStore((s) => s.removeFavorite);

  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] =
    useState<ContentCategory | 'all'>('all');

  const categories: Array<ContentCategory | 'all'> = [
    'all',
    ...new Set(favorites.map((f) => f.category)),
  ];

  const filtered = favorites.filter((f) => {
    const matchesSearch = f.title
      .toLowerCase()
      .includes(filter.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' ||
      f.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Her Favorites
      </h2>

      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const selected = categoryFilter === cat;

          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`hana-card px-3 py-1.5 text-xs font-medium capitalize ${
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
              {cat === 'all'
                ? 'All'
                : getCategoryLabel(cat)}
            </button>
          );
        })}
      </div>

      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
        />

        <input
          type="text"
          placeholder="Search favorites..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="hana-input pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p
            className="mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Nothing here yet.
          </p>

          <p
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Give the place a little personality.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="hana-card p-4 flex items-center justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">
                  {item.title}
                </p>

                <p
                  className="text-xs mt-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {getCategoryLabel(item.category)} •{' '}
                  {new Date(
                    item.savedAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => removeFavorite(item.id)}
                className="p-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor:
                    'var(--card-border)',
                }}
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

