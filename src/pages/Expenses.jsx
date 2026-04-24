import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import { CURRENCIES, formatAmount } from '../utils/currency'

function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-[30px] p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-400/25 bg-red-500/12 text-2xl text-red-300">
          !
        </div>
        <h2 className="mt-5 text-2xl font-bold theme-text">O&apos;chirishni tasdiqlang</h2>
        <p className="soft-text mt-3 text-sm leading-6">
          Bu xarajat butunlay o&apos;chiriladi. Amalni keyin qaytarib bo&apos;lmaydi.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={onCancel} className="ghost-button w-full rounded-2xl px-4 py-3 text-sm font-medium transition">
            Bekor qilish
          </button>
          <button onClick={onConfirm} className="danger-button w-full rounded-2xl px-4 py-3 text-sm font-semibold transition">
            O&apos;chirish
          </button>
        </div>
      </div>
    </div>
  )
}



function ExpenseModal({ form, setForm, onSubmit, onClose, submitting, error }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl rounded-[30px] p-8 sm:p-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="section-badge">New Entry</span>
            <h2 className="panel-title mt-3 text-3xl">Yangi xarajat</h2>
            <p className="soft-text mt-2 text-sm">
              Xarajat ma'lumotlarini kiriting — AI avtomatik kategoriyalaydi
            </p>
          </div>
          <button
            onClick={onClose}
            className="ghost-button w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="theme-alert-danger mb-6 rounded-[22px] px-5 py-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2" noValidate>
          <div>
            <label className="mb-2 block text-sm font-medium theme-label">Sarlavha</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="dark-input px-5 py-4 text-sm"
              placeholder="Masalan: Tushlik yoki supermarket"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium theme-label">
              Summa ({CURRENCIES.find(c => c.code === (form.currency || 'UZS'))?.symbol || "so'm"})
            </label>
            <div className="grid grid-cols-[minmax(0,1fr)_130px] gap-3">
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className="dark-input px-5 py-4 text-sm"
                placeholder="50000"
                required
              />
              <select
                value={form.currency || 'UZS'}
                onChange={e => setForm({ ...form, currency: e.target.value })}
                className="dark-select px-3 py-4 text-sm"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
            </div>
            {form.currency && form.currency !== 'UZS' && form.amount && (
              <p className="mt-2 text-xs theme-text-soft">
                ≈ Avtomatik ravishda so'mga konvertatsiya qilinadi
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium theme-label">Sana</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="dark-input px-5 py-4 text-sm"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium theme-label">
              Tavsif <span className="theme-text-subtle">(ixtiyoriy)</span>
            </label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="dark-input px-5 py-4 text-sm"
              placeholder="Qisqa izoh yozing"
            />
          </div>

          {/* AI hint */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 px-5 py-3">
              <span style={{ fontSize: '20px' }}>🤖</span>
              <p className="text-xs theme-text-soft">
                AI xarajat sarlavhasini o'qib, avtomatik kategoriyani aniqlaydi va tegishli ikonka belgilaydi.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="ghost-button flex-1 rounded-2xl px-5 py-4 text-sm font-medium transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="glow-button flex-1 rounded-2xl px-5 py-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Saqlanmoqda...' : '💾 Xarajatni saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    amount: '',
    date: '',
    description: '',
    currency: 'UZS',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrError, setOcrError] = useState('')
  const fileInputRef = useRef(null)
  const [ocrSuccess, setOcrSuccess] = useState(false)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses')
      setExpenses(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOcr = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setOcrLoading(true)
    setOcrError('')

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const res = await api.post('/expenses/ocr', { image: base64 })
      const raw = res.data.data
      const cleaned = raw.replace(/```json|```/g, '').trim()

      let parsed
      try {
        parsed = JSON.parse(cleaned)
      } catch {
        setOcrError("Chekni o'qishda xatolik! Rasm aniq va yorug' bo'lsin.")
        return
      }

      if (!parsed.title && !parsed.amount) {
        setOcrError("Chekdan ma'lumot o'qib bo'lmadi! Rasmni aniqroq oling.")
        return
      }

      setForm({
        title: parsed.title || '',
        amount: parsed.amount || '',
        date: parsed.date || new Date().toISOString().split('T')[0],
        description: parsed.description || '',
        currency: 'UZS',
      })

      setOcrSuccess(true)
      setShowForm(true)
      setOcrError('')
    } catch (err) {
      setOcrError("Chekni o'qishda xatolik! Rasmni aniqroq oling.")
      console.error(err)
    } finally {
      setOcrLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!form.title) {
      setError("Sarlavha bo'sh bo'lmasin!")
      setSubmitting(false)
      return
    }
    if (!form.amount) {
      setError("Summa bo'sh bo'lmasin!")
      setSubmitting(false)
      return
    }
    if (Number(form.amount) <= 0) {
      setError("Summa musbat bo'lsin!")
      setSubmitting(false)
      return
    }
    if (!form.date) {
      setError("Sana bo'sh bo'lmasin!")
      setSubmitting(false)
      return
    }

    try {
      await api.post('/expenses', {
        ...form,
        amount: parseFloat(form.amount),
      })
      setForm({ title: '', amount: '', date: '', description: '', currency: 'UZS' })
      setShowForm(false)
      setOcrSuccess(false)
      fetchExpenses()
    } catch (err) {
      const data = err.response?.data
      if (typeof data === 'object' && !data.error) {
        const messages = Object.values(data).join(', ')
        setError(messages)
      } else {
        setError(data?.error || 'Xatolik yuz berdi!')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/expenses/${deleteId}`)
      setExpenses(expenses.filter(expense => expense.id !== deleteId))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteId(null)
    }
  }

  const handleExport = async (type) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/export/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = type === 'excel' ? 'xarajatlar.xlsx' : 'xarajatlar.pdf'
      anchor.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Eksport xatolik:', err)
    }
  }

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const thisMonthKey = new Date().toISOString().slice(0, 7)
  const monthlyCount = expenses.filter(e => String(e.date || '').startsWith(thisMonthKey)).length
  const largestExpense = expenses.reduce((max, e) => {
    if (!max || Number(e.amount) > Number(max.amount)) return e
    return max
  }, null)

  return (
    <div className="app-shell">
      <Navbar />

      {deleteId && (
        <ConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {showForm && (
        <ExpenseModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false)
            setOcrSuccess(false)
            setError('')
            setForm({ title: '', amount: '', date: '', description: '', currency: 'UZS' })
          }}
          submitting={submitting}
          error={error}
        />
      )}

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-10 sm:px-6 lg:px-8">
        <section className="glass-card-highlight rounded-[34px] p-6 sm:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <span className="section-badge">Expense Manager</span>
              <h1 className="page-title mt-4 text-4xl font-extrabold theme-text sm:text-5xl">
                Xarajatlaringizni tez boshqaring
              </h1>
              <p className="soft-text mt-4 max-w-xl text-sm leading-7 sm:text-base">
                Chek skan qilish, yangi xarajat qo'shish va eksport olish funksiyalari zamonaviy UI ichida.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap xl:w-auto xl:justify-end">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleOcr}
                className="hidden"
                id="ocr-input"
              />
              <label
                htmlFor="ocr-input"
                className={`rounded-2xl px-5 py-3 text-center text-sm font-semibold transition ${
                  ocrLoading ? 'ghost-button cursor-not-allowed opacity-70' : 'ghost-button cursor-pointer'
                }`}
              >
                {ocrLoading ? "Chek o'qilmoqda..." : 'Chek skan'}
              </label>

              <button
                onClick={() => handleExport('excel')}
                className="ghost-button rounded-2xl px-5 py-3 text-sm font-medium transition"
              >
                Excel eksport
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="ghost-button rounded-2xl px-5 py-3 text-sm font-medium transition"
              >
                PDF eksport
              </button>
              <button
                onClick={() => {
                  setShowForm(true)
                  setOcrSuccess(false)
                  setError('')
                }}
                className="glow-button rounded-2xl px-5 py-3 text-sm font-semibold transition"
              >
                Yangi xarajat
              </button>
            </div>
          </div>
        </section>

        {ocrError && (
          <div className="theme-alert-danger glass-card mt-6 rounded-[26px] p-4 text-sm">
            {ocrError}
          </div>
        )}

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              label: 'Jami sarf',
              value: `${totalSpent.toLocaleString()} so'm`,
              note: "Barcha yozuvlar bo'yicha umumiy summa",
            },
            {
              label: 'Joriy oy',
              value: `${monthlyCount} ta`,
              note: "Shu oyda qo'shilgan xarajatlar soni",
            },
            {
              label: 'Eng katta xarajat',
              value: largestExpense
                ? formatAmount(largestExpense.amount, largestExpense.originalCurrency || 'UZS')
                : "0 so'm",
              note: largestExpense ? largestExpense.title : "Hozircha ma'lumot yo'q",
            },
          ].map(item => (
            <div key={item.label} className="glass-card rounded-[28px] p-5 sm:p-6">
              <p className="text-sm font-medium theme-text-soft">{item.label}</p>
              <p className="stat-value mt-3 text-3xl font-extrabold tracking-[-0.04em]">{item.value}</p>
              <p className="soft-text mt-3 text-sm leading-6">{item.note}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 glass-card rounded-[30px] p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-badge">Expense List</span>
              <h2 className="panel-title mt-4 text-2xl">Barcha xarajatlar</h2>
              <p className="soft-text mt-2 text-sm">
                Ro'yxat mobil qurilmalarda ham qulay o'qiladigan kartalar ko'rinishida.
              </p>
            </div>
            <div className="theme-chip rounded-full px-4 py-2 text-sm">
              {expenses.length} ta yozuv
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-400"/>
            </div>
          ) : expenses.length === 0 ? (
            <div className="glass-card-soft mt-6 flex flex-col items-center rounded-[24px] px-6 py-14 text-center">
              <div className="theme-chip rounded-full px-4 py-2 text-sm">Hozircha bo'sh</div>
              <h3 className="mt-5 text-xl font-semibold theme-text">Hali xarajat yo'q</h3>
              <p className="soft-text mt-2 max-w-md text-sm">
                Birinchi xarajatni qo'shganingizdan keyin bu sahifa jonlanadi.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="glow-button mt-6 rounded-2xl px-5 py-3 text-sm font-semibold transition"
              >
                Birinchi xarajatni qo'shish
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {expenses.map(expense => (
                <article
                  key={expense.id}
                  className="glass-card-soft flex flex-col gap-4 rounded-[26px] p-4 transition hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--theme-chip-border)] text-base theme-text"
                      style={{ backgroundColor: `${expense.categoryColor || '#6366f1'}22` }}
                    >
                      {expense.categoryIcon || '$'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold theme-text sm:text-base">
                          {expense.title}
                        </h3>
                        <span className="theme-chip rounded-full px-2.5 py-1 text-[11px]">
                          {expense.categoryName}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-6 theme-text-faint">
                        {expense.date}
                        {expense.description && ` - ${expense.description}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end">
                    <div className="sm:text-right">
                      <p className="text-base font-semibold theme-text sm:text-lg">
                        {Number(expense.amount).toLocaleString()} so'm
                      </p>
                      {expense.originalAmount && expense.originalCurrency && (
                        <p className="mt-1 text-xs theme-text-subtle">
                          Asl summa: {formatAmount(expense.originalAmount, expense.originalCurrency)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setDeleteId(expense.id)}
                      className="theme-alert-danger rounded-2xl px-4 py-2 text-sm font-medium transition hover:opacity-90"
                    >
                      O&apos;chirish
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}