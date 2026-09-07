import { useState } from 'react';
import { Heart, Palette, Shuffle, Globe, Settings } from 'lucide-react';
import Favorites from './Favorites';
import MyAesthetic from './MyAesthetic';
import RandomlyHana from './RandomlyHana';
import MyWorld from './MyWorld';
import SettingsPage from './Settings';
import type { SubPage } from '@/types';

const subPages: { id: SubPage; label: string; icon: React.ElementType; component: React.FC }[] = [
  { id: 'favorites', label: 'Favorites', icon: Heart, component: Favorites },
  { id: 'aesthetic', label: 'My Aesthetic', icon: Palette, component: MyAesthetic },
  { id: 'randomly', label: 'Randomly Hana', icon: Shuffle, component: RandomlyHana },
  { id: 'world', label: 'My World', icon: Globe, component: MyWorld },
  { id: 'settings', label: 'Settings', icon: Settings, component: SettingsPage },
];

export default function Me() {
  const [activeSubPage, setActiveSubPage] = useState<SubPage | null>(null);

  if (activeSubPage) {
    const page = subPages.find((p) => p.id === activeSubPage);
    if (page) {
      const Component = page.component;
      return (
        <div className="px-5 pt-8 pb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveSubPage(null)}
            className="hana-btn hana-btn-outline mb-6 text-sm py-2 px-4"
          >
            ← Back
          </button>
          <Component />
        </div>
      );
    }
  }

  return (
    <div className="px-5 pt-8 pb-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Me</h1>
      <div className="space-y-3">
        {subPages.map((page) => {
          const Icon = page.icon;
          return (
            <button
              key={page.id}
              onClick={() => setActiveSubPage(page.id)}
              className="hana-card w-full p-4 flex items-center gap-4 text-left transition-all hover:opacity-80"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary)', opacity: 0.2 }}
              >
                <Icon size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <span className="font-medium">{page.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
