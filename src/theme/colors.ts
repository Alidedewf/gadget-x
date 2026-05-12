export const colors = {
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
    primary: '#8b31ff', // Неоновый фиолетовый со скрина xgadget
    primaryMuted: '#f3e8ff',
    border: '#e2e8f0',
    cardShadow: 'rgba(139, 49, 255, 0.1)',
    success: '#10b981',
    successBg: '#d1fae5',
  },
  dark: {
    background: '#090514', // Глубокий темно-фиолетовый (почти черный) фон
    surface: '#150a24', // Фон карточек чуть светлее (премиум-пурпурный)
    text: '#ffffff',
    textMuted: '#a78bfa',
    primary: '#a855f7', // Светлый неоново-фиолетовый для темной темы
    primaryMuted: '#2e1065',
    border: '#3b0764',
    cardShadow: 'rgba(139, 49, 255, 0.2)',
    success: '#34d399',
    successBg: '#064e3b',
  }
};

export type AppColors = typeof colors.light;
