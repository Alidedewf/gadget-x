/**
 * Утилиты для работы с валютой.
 * Цены хранятся в KZT (тенге). Форматирование: "3 990 ₸"
 */

/** Символ валюты */
export const CURRENCY_SYMBOL = '₸';

/**
 * Форматирует число в строку цены с разделителями тысяч и символом ₸.
 * @example formatPrice(3990)  → "3 990 ₸"
 * @example formatPrice(12000) → "12 000 ₸"
 */
export function formatPrice(price: number): string {
  const formatted = price.toLocaleString('ru-RU');
  return `${formatted} ${CURRENCY_SYMBOL}`;
}

/**
 * Форматирует цену компактно (без символа, только число с разделителями).
 * Используется там, где символ рендерится отдельно.
 * @example formatPriceNumber(3990) → "3 990"
 */
export function formatPriceNumber(price: number): string {
  return price.toLocaleString('ru-RU');
}
