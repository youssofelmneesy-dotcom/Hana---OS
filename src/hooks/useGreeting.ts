import { useMemo } from 'react';
import { getGreeting } from '@/utils/helpers';

export function useGreeting(name: string = 'Hana'): string {
  return useMemo(() => `${getGreeting()}, ${name}.`, [name]);
}
