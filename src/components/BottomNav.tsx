import { Home, Compass, Shield, Heart, User } from 'lucide-react';
import type { Page } from '@/types';

interface Props {
  current: Page;
  onChange: (page: Page) => void;
}

const items: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'safe', label: 'Safe', icon: Shield },
  { id: 'pray', label: 'Pray', icon: Heart },
  { id: 'me', label: 'Me', icon: User },
];

export default function BottomNav({ current, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2">
      <div
        className="hana-card flex justify-around items-center py-3 max-w-md mx-auto"
        style={{ borderRadius: '24px' }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center gap-1 px-4 py-1 transition-all"
            >
              <Icon
                size={22}
                style={{
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                }}
              />
              <span
                className="text-[10px] font-medium"
                style={{
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

