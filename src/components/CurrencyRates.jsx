import { useEffect, useState } from 'react'
import api from '../api/axios'
import { CURRENCIES } from '../utils/currency'

export default function CurrencyRates() {
  const [rates, setRates] = useState(null)
  const [base, setBase] = useState('USD')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRates()
  }, [base])

  const fetchRates = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/currency/rates/${base}`)
      setRates(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const displayCurrencies = CURRENCIES.filter((currency) => currency.code !== base)

  return (
    <section className="glass-card rounded-[28px] p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="section-badge">Live Currency</span>
          <h2 className="panel-title mt-3 text-xl">Valyuta kurslari</h2>
          <p className="soft-text mt-2 text-sm">
            Asosiy valyutani tanlang va boshqa kurslarni bir joyda kuzating.
          </p>
        </div>

        <select
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="dark-select min-w-[130px] px-4 py-3 text-sm"
        >
          {CURRENCIES.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-400" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {displayCurrencies.map((currency) => (
            <div
              key={currency.code}
              className="glass-card-soft rounded-[22px] p-4 text-left transition hover:-translate-y-1 hover:border-[var(--theme-chip-border)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="theme-chip rounded-full px-2.5 py-1 text-[11px] font-semibold">
                  {currency.code}
                </span>
                <span className="text-lg theme-text-faint">{currency.symbol}</span>
              </div>
              <p className="text-sm font-semibold theme-text">{currency.name}</p>
              <p className="mt-2 text-lg font-bold theme-text">
                {rates?.[currency.code]
                  ? Number(rates[currency.code]).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : '—'}
              </p>
              <p className="mt-1 text-xs theme-text-subtle">1 {base} uchun kurs</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
