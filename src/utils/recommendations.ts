import type { ContentItem, Mood, UserPreferences, Interaction } from '@/types';
import { getEnergyForMood } from './helpers';

export function calculateRecommendationScore(
  item: ContentItem,
  currentMood: Mood | null,
  preferences: UserPreferences,
  interactions: Interaction[],
  hiddenIds: string[]
): number {
  if (hiddenIds.includes(item.id)) return -999;

  let score = 0;
  const randomness = Math.random() * 0.5;

  // Mood match (30%)
  if (currentMood) {
    const moodMatch = item.moods.includes(currentMood) ? 1 : 0;
    const targetEnergy = getEnergyForMood(currentMood);
    const energyDiff = Math.abs(item.energy - targetEnergy);
    const energyMatch = Math.max(0, 1 - energyDiff / 10);
    score += (moodMatch * 0.6 + energyMatch * 0.4) * 0.30;
  }

  // Preference match (25%)
  let prefScore = 0;
  let prefCount = 0;

  if (item.artist && preferences.artists[item.artist]) {
    prefScore += preferences.artists[item.artist] / 10;
    prefCount++;
  }

  if (preferences.contentTypes[item.category]) {
    prefScore += preferences.contentTypes[item.category] / 10;
    prefCount++;
  }

  if (item.language && preferences.languages[item.language]) {
    prefScore += preferences.languages[item.language] / 10;
    prefCount++;
  }

  item.tags.forEach((tag) => {
    if (preferences.tags[tag]) {
      prefScore += preferences.tags[tag] / 10;
      prefCount++;
    }
  });

  if (prefCount > 0) {
    score += (prefScore / prefCount) * 0.25;
  }

  // Recent behavior (5%)
  const recentInteractions = interactions.slice(-20);
  const itemInteractions = recentInteractions.filter((i) => i.contentId === item.id);
  let behaviorScore = 0;
  itemInteractions.forEach((i) => {
    if (i.action === 'love') behaviorScore += 0.7;
    else if (i.action === 'save') behaviorScore += 0.5;
    else if (i.action === 'play') behaviorScore += 0.2;
    else if (i.action === 'open') behaviorScore += 0.1;
    else if (i.action === 'skip') behaviorScore -= 0.2;
    else if (i.action === 'hide') behaviorScore -= 0.6;
  });
  score += Math.max(-0.05, Math.min(0.05, behaviorScore * 0.05));

  // Randomness (5%)
  score += randomness * 0.05;

  // Artist match (10%)
  if (item.artist && preferences.artists[item.artist]) {
    score += (preferences.artists[item.artist] / 10) * 0.10;
  }

  // Tag match (10%)
  let tagScore = 0;
  item.tags.forEach((tag) => {
    if (preferences.tags[tag]) {
      tagScore += preferences.tags[tag] / 10;
    }
  });
  if (item.tags.length > 0) {
    score += (tagScore / item.tags.length) * 0.10;
  }

  return score;
}

export function getRecommendations(
  items: ContentItem[],
  currentMood: Mood | null,
  preferences: UserPreferences,
  interactions: Interaction[],
  hiddenIds: string[],
  count: number = 10,
  includeExploration: boolean = true
): ContentItem[] {
  const scored = items.map((item) => ({
    item,
    score: calculateRecommendationScore(item, currentMood, preferences, interactions, hiddenIds),
  }));

  scored.sort((a, b) => b.score - a.score);

  if (includeExploration) {
    const familiarCount = Math.floor(count * 0.8);
    const explorationCount = count - familiarCount;

    const familiar = scored.slice(0, familiarCount).map((s) => s.item);
    const exploration = scored.slice(familiarCount, familiarCount + explorationCount + 5)
      .sort(() => Math.random() - 0.5)
      .slice(0, explorationCount)
      .map((s) => s.item);

    return [...familiar, ...exploration];
  }

  return scored.slice(0, count).map((s) => s.item);
}

export function getComfortMix(
  items: ContentItem[],
  currentMood: Mood | null,
  preferences: UserPreferences,
  interactions: Interaction[],
  hiddenIds: string[]
): ContentItem[] {
  const categories: ContentItem['category'][] = ['music', 'short', 'quran', 'dua', 'quote'];
  const mix: ContentItem[] = [];

  categories.forEach((cat) => {
    const catItems = items.filter((i) => i.category === cat && !hiddenIds.includes(i.id));
    if (catItems.length > 0) {
      const scored = catItems.map((item) => ({
        item,
        score: calculateRecommendationScore(item, currentMood, preferences, interactions, hiddenIds),
      }));
      scored.sort((a, b) => b.score - a.score);
      if (scored[0]) mix.push(scored[0].item);
    }
  });

  return mix;
}
