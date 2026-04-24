export const CURRENCIES = [
  { code: 'UZS', name: 'So\'m', symbol: 'so\'m', flag: '🇺🇿' },
  { code: 'USD', name: 'Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'RUB', name: 'Rubl', symbol: '₽', flag: '🇷🇺' },
  { code: 'GBP', name: 'Funt', symbol: '£', flag: '🇬🇧' },
  { code: 'KZT', name: 'Tenge', symbol: '₸', flag: '🇰🇿' },
  { code: 'TRY', name: 'Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'AED', name: 'Dirham', symbol: 'د.إ', flag: '🇦🇪' },
]

export const formatAmount = (amount, currency = 'UZS') => {
  const cur = CURRENCIES.find(c => c.code === currency)
  const symbol = cur?.symbol || currency
  return `${Number(amount).toLocaleString()} ${symbol}`
}