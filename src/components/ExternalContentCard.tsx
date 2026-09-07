import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Heart,
  Music2,
  Play,
  X,
} from 'lucide-react';
import type { ContentItem } from '@/types';
import { useHanaStore } from '@/store/useHanaStore';
import { getCategoryLabel } from '@/utils/helpers';

interface Props {
  item: ContentItem;
  compact?: boolean;
}

function normalizeUrl(value?: string): string | undefined {
  if (!value) return undefined;

  const markdownMatch = value.match(
    /\[[^\]]*\]\((https?:\/\/[^)]+)\)/
  );

  if (markdownMatch?.[1]) {
    return markdownMatch[1];
  }

  return value.trim();
}

function isPlaceholderUrl(value?: string): boolean {
  if (!value) return true;

  return /(?:example\d*|quran\d+|short\d+)/i.test(value);
}

function getYouTubeId(url?: string): string | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '');
    }

    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v') ?? undefined;
      }

      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/shorts/')[1];
      }

      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/embed/')[1];
      }
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function getSpotifyTrackId(url?: string): string | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);

    if (
      parsed.hostname.includes('spotify.com') &&
      parsed.pathname.startsWith('/track/')
    ) {
      return parsed.pathname.split('/track/')[1];
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function getEmbedUrl(item: ContentItem): string | undefined {
  const directEmbed = normalizeUrl(item.embedUrl);

  if (
    directEmbed &&
    !isPlaceholderUrl(directEmbed)
  ) {
    return directEmbed;
  }

  const url = normalizeUrl(item.url);

  if (!url || isPlaceholderUrl(url)) {
    return undefined;
  }

  if (item.source === 'youtube') {
    const id = getYouTubeId(url);

    if (id) {
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
    }
  }

  if (item.source === 'spotify') {
    const id = getSpotifyTrackId(url);

    if (id) {
      return `https://open.spotify.com/embed/track/${id}?utm_source=generator`;
    }
  }

  return undefined;
}

function getSafeImage(item: ContentItem): string | undefined {
  const image = normalizeUrl(item.image);

  if (!image || isPlaceholderUrl(image)) {
    return undefined;
  }

  return image;
}

export default function ExternalContentCard({
  item,
  compact = false,
}: Props) {
  const [imageError, setImageError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleFavorite = useHanaStore(
    (s) => s.toggleFavorite
  );

  const hideContent = useHanaStore(
    (s) => s.hideContent
  );

  const addInteraction = useHanaStore(
    (s) => s.addInteraction
  );

  const isFav = useHanaStore((s) =>
    s.favorites.some((f) => f.id === item.id)
  );

  const embedUrl = useMemo(
    () => getEmbedUrl(item),
    [item]
  );

  const imageUrl = useMemo(
    () => getSafeImage(item),
    [item]
  );

  const isPlayable = Boolean(embedUrl);

  const handleCardClick = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (isPlayable) {
      setIsPlaying(true);

      addInteraction({
        contentId: item.id,
        action: 'open',
      });

      return;
    }

    if (item.url) {
      const url = normalizeUrl(item.url);

      if (url && !isPlaceholderUrl(url)) {
        addInteraction({
          contentId: item.id,
          action: 'open',
        });

        window.open(
          url,
          '_blank',
          'noopener,noreferrer'
        );
      }
    }
  };

  const handleFavorite = (
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    toggleFavorite(item);
  };

  const handleHide = (
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    hideContent(item.id);
  };

  const handleExternalOpen = (
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    const url = normalizeUrl(item.url);

    if (!url || isPlaceholderUrl(url)) {
      return;
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.985 }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          handleCardClick();
        }
      }}
      className={`hana-card overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
        compact ? 'w-[170px]' : 'w-full'
      }`}
    >
      {/* Player */}
      {isPlaying && embedUrl ? (
        <div
          className={
            compact
              ? 'aspect-video bg-black'
              : 'aspect-video bg-black'
          }
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <iframe
            src={embedUrl}
            title={item.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <>
          {/* Thumbnail */}
          {!imageError && imageUrl ? (
            <div
              className="h-32 bg-cover bg-center relative"
              style={{
                backgroundImage: `url("${imageUrl}")`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />

              {isPlayable && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play
                      size={18}
                      className="ml-0.5"
                      style={{
                        color: 'var(--primary)',
                        fill: 'var(--primary)',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="h-32 flex items-center justify-center relative"
              style={{
                background:
                  'var(--bg-secondary)',
              }}
            >
              <Music2
                size={32}
                style={{
                  color: 'var(--primary)',
                  opacity: 0.35,
                }}
              />

              {isPlayable && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-[var(--card)] flex items-center justify-center shadow-lg">
                    <Play
                      size={18}
                      style={{
                        color: 'var(--primary)',
                        fill: 'var(--primary)',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className="text-[10px] uppercase tracking-wider mb-1"
              style={{
                color: 'var(--primary)',
              }}
            >
              {getCategoryLabel(item.category)}
            </p>

            <h3 className="font-medium text-sm truncate">
              {item.title}
            </h3>

            {item.artist && (
              <p
                className="text-xs mt-0.5 truncate"
                style={{
                  color: 'var(--text-muted)',
                }}
              >
                {item.artist}
              </p>
            )}

            {item.reciter && (
              <p
                className="text-xs mt-0.5 truncate"
                style={{
                  color: 'var(--text-muted)',
                }}
              >
                {item.reciter}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleFavorite}
            className="p-1.5 rounded-full transition-all flex-shrink-0"
            style={{
              backgroundColor: isFav
                ? 'var(--primary)'
                : 'var(--card-border)',
            }}
            aria-label={
              isFav
                ? 'Remove from favorites'
                : 'Save to favorites'
            }
          >
            <Heart
              size={14}
              className={
                isFav
                  ? 'text-white fill-white'
                  : ''
              }
            />
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              if (isPlayable) {
                handleCardClick();
              } else {
                handleExternalOpen(event);
              }
            }}
            className="hana-btn text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5"
          >
            {isPlayable ? (
              <>
                <Play size={12} />
                {isPlaying ? 'Close' : 'Play'}
              </>
            ) : (
              <>
                <ExternalLink size={12} />
                Open
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleHide}
            className="hana-btn hana-btn-outline text-xs py-2 px-3"
            aria-label="Hide content"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

