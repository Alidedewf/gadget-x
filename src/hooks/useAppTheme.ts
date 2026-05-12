import { useStore } from '../store/useStore';
import { colors, AppColors } from '../theme/colors';

export function useAppTheme(): { theme: 'light' | 'dark'; c: AppColors } {
  const theme = useStore((state) => state.theme);
  return {
    theme,
    c: colors[theme],
  };
}
