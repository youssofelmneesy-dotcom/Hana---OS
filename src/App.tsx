import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useHanaStore } from '@/store/useHanaStore';
import { getThemeCSS } from '@/utils/helpers';
import IntroScreen from '@/components/IntroScreen';
import Onboarding from '@/components/Onboarding';
import BottomNav from '@/components/BottomNav';
import Home from '@/pages/Home';
import Discover from '@/pages/Discover';
import SafeZone from '@/pages/SafeZone';
import Pray from '@/pages/Pray';
import Me from '@/pages/Me';
import type { Mood, Page } from '@/types';

const LIGHT_MOODS: Mood[] = [
  'good',
  'okay',
  'excited',
  'energetic',
];

const MOOD_THEMES: Record<
  Mood,
  {
    bg: string;
    bgSecondary: string;
    card: string;
    border: string;
    text: string;
    muted: string;
    primary: string;
    accent: string;
  }
> = {
  good: {
    bg: '#F8F1E8',
    bgSecondary: '#F1E5D6',
    card: 'rgba(255, 250, 243, 0.88)',
    border: 'rgba(181, 139, 93, 0.20)',
    text: '#34281F',
    muted: '#8B7765',
    primary: '#C58B5A',
    accent: '#E3A66B',
  },

  okay: {
    bg: '#F3F1E8',
    bgSecondary: '#E9E7D9',
    card: 'rgba(250, 249, 242, 0.90)',
    border: 'rgba(116, 124, 91, 0.20)',
    text: '#30332A',
    muted: '#7C806C',
    primary: '#8D956A',
    accent: '#B5B98B',
  },

  excited: {
    bg: '#FFF0EC',
    bgSecondary: '#FFE0D8',
    card: 'rgba(255, 248, 246, 0.90)',
    border: 'rgba(222, 107, 91, 0.22)',
    text: '#38221F',
    muted: '#946B64',
    primary: '#D96E5C',
    accent: '#F19A7F',
  },

  energetic: {
    bg: '#FFF3D9',
    bgSecondary: '#FFE5AC',
    card: 'rgba(255, 250, 237, 0.90)',
    border: 'rgba(214, 148, 42, 0.22)',
    text: '#382A17',
    muted: '#92764A',
    primary: '#D7952F',
    accent: '#F0B84B',
  },

  tired: {
    bg: '#E8E9F0',
    bgSecondary: '#DCDDE7',
    card: 'rgba(244, 244, 249, 0.88)',
    border: 'rgba(102, 107, 137, 0.20)',
    text: '#292B38',
    muted: '#74788C',
    primary: '#777D9F',
    accent: '#9B91B4',
  },

  sad: {
    bg: '#DDE5F0',
    bgSecondary: '#CCD8E8',
    card: 'rgba(239, 244, 250, 0.88)',
    border: 'rgba(74, 101, 139, 0.20)',
    text: '#202A38',
    muted: '#68758A',
    primary: '#5E7597',
    accent: '#829BC0',
  },

  overwhelmed: {
    bg: '#E4E2E3',
    bgSecondary: '#D4D0D2',
    card: 'rgba(241, 239, 240, 0.90)',
    border: 'rgba(112, 102, 108, 0.20)',
    text: '#2F2B2E',
    muted: '#777074',
    primary: '#817177',
    accent: '#A8929B',
  },

  calm: {
    bg: '#E5EEE8',
    bgSecondary: '#D4E3D9',
    card: 'rgba(243, 248, 245, 0.90)',
    border: 'rgba(81, 119, 96, 0.20)',
    text: '#24332A',
    muted: '#6E8175',
    primary: '#668B73',
    accent: '#91AE9A',
  },

  bored: {
    bg: '#EEE8F5',
    bgSecondary: '#DED4EC',
    card: 'rgba(248, 245, 251, 0.90)',
    border: 'rgba(123, 96, 151, 0.20)',
    text: '#30263A',
    muted: '#7E708B',
    primary: '#9173AD',
    accent: '#B49BC9',
  },

  'need-quiet': {
    bg: '#E1E8EC',
    bgSecondary: '#D1DCE2',
    card: 'rgba(241, 246, 248, 0.90)',
    border: 'rgba(75, 101, 115, 0.20)',
    text: '#263137',
    muted: '#6D7B82',
    primary: '#607E8C',
    accent: '#8FA8B2',
  },

  'need-distraction': {
    bg: '#EAE2F1',
    bgSecondary: '#DCCCE9',
    card: 'rgba(247, 242, 251, 0.90)',
    border: 'rgba(123, 77, 150, 0.22)',
    text: '#302438',
    muted: '#786681',
    primary: '#8C62A5',
    accent: '#C07AC2',
  },

  'need-spiritual': {
    bg: '#E3EBDD',
    bgSecondary: '#D1DEC5',
    card: 'rgba(243, 247, 238, 0.90)',
    border: 'rgba(70, 105, 63, 0.20)',
    text: '#263125',
    muted: '#6E7B68',
    primary: '#64805B',
    accent: '#B29A58',
  },

  'late-night': {
    bg: '#151827',
    bgSecondary: '#20243A',
    card: 'rgba(31, 35, 55, 0.88)',
    border: 'rgba(143, 128, 177, 0.20)',
    text: '#F2EEF8',
    muted: '#AAA4B9',
    primary: '#A68BC7',
    accent: '#D49AB8',
  },
};

export default function App() {
  const hasOnboarded = useHanaStore((s) => s.hasOnboarded);
  const aesthetic = useHanaStore((s) => s.aesthetic);
  const currentMood = useHanaStore((s) => s.currentMood);

  const [showIntro, setShowIntro] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  /*
   * Current mood controls the visual theme.
   * If there is no current mood yet, we fall back to the saved aesthetic.
   */
  const activeAesthetic = useMemo(() => {
    if (!currentMood) {
      return aesthetic;
    }

    const theme = MOOD_THEMES[currentMood];

    return {
      ...aesthetic,
      primaryColor: theme.primary,
      accentColor: theme.accent,
      backgroundTone: LIGHT_MOODS.includes(currentMood) ? 'light' : 'dark',
    };
  }, [currentMood, aesthetic]);

  /*
   * Apply theme variables globally.
   */
  useEffect(() => {
    const css = getThemeCSS(activeAesthetic);

    Object.entries(css).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    if (currentMood) {
      const theme = MOOD_THEMES[currentMood];

      document.documentElement.style.setProperty('--bg', theme.bg);
      document.documentElement.style.setProperty(
        '--bg-secondary',
        theme.bgSecondary
      );
      document.documentElement.style.setProperty('--card', theme.card);
      document.documentElement.style.setProperty(
        '--card-border',
        theme.border
      );
      document.documentElement.style.setProperty('--text', theme.text);
      document.documentElement.style.setProperty('--text-muted', theme.muted);
      document.documentElement.style.setProperty(
        '--primary',
        theme.primary
      );
      document.documentElement.style.setProperty(
        '--accent',
        theme.accent
      );
    }
  }, [activeAesthetic, currentMood]);

  /*
   * Whenever the page changes, always start from the top.
   * This fixes the "blank page until I scroll" feeling.
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [currentPage]);

  /*
   * Allows cards inside pages to navigate without introducing
   * another global navigation library/context.
   */
  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const page = (event as CustomEvent<Page>).detail;

      const validPages: Page[] = [
        'home',
        'discover',
        'safe',
        'pray',
        'me',
      ];

      if (validPages.includes(page)) {
        setCurrentPage(page);
      }
    };

    window.addEventListener('hana:navigate', handleNavigate);

    return () => {
      window.removeEventListener('hana:navigate', handleNavigate);
    };
  }, []);

  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  if (!hasOnboarded) {
    return <Onboarding onComplete={() => {}} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'discover':
        return <Discover />;

      case 'safe':
        return <SafeZone />;

      case 'pray':
        return <Pray />;

      case 'me':
        return <Me />;

      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div
      className="min-h-screen safe-bottom pb-24"
      style={{
        background: 'var(--bg)',
        color: 'var(--text)',
        transition:
          'background-color 500ms ease, color 500ms ease',
      }}
    >
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {renderPage()}
      </motion.div>

      <BottomNav
        current={currentPage}
        onChange={setCurrentPage}
      />
    </div>
  );
}

