import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import CurrencyRates from '../components/CurrencyRates'
import LoadingScreen from '../components/LoadingScreen'

const COLORS = ['#8b5cf6', '#60a5fa', '#22c55e', '#f59e0b', '#f43f5e', '#14b8a6', '#818cf8', '#94a3b8']

export default function Dashboard() {
  const [report, setReport] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const now = new Date()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [reportRes, expensesRes] = await Promise.all([
        api.get(`/expenses/report?year=${now.getFullYear()}&month=${now.getMonth() + 1}`),
        api.get('/expenses'),
      ])
      setReport(reportRes.data)
      setExpenses(expensesRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const pieData = report?.categories
    ? Object.entries(report.categories).map(([name, value]) => ({ name, value }))
    : []

  const barData = expenses
    .slice(0, 7)
    .reverse()
    .map((expense) => ({
      name: expense.title.length > 10 ? `${expense.title.slice(0, 10)}...` : expense.title,
      amount: expense.amount,
    }))

  const totalAmount = report?.total || 0
  const averageExpense = expenses.length ? Math.round(totalAmount / Math.max(pieData.length || 1, 1)) : 0

  if (loading) return <LoadingScreen message="Dashboard yuklanmoqda" />

  return (
    <div className="app-shell">
      <Navbar />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-10 sm:px-6 lg:px-8">
        <section className="glass-card-highlight rounded-[34px] p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="section-badge">Monthly Overview</span>
              <h1 className="page-title mt-4 text-4xl font-extrabold theme-text sm:text-5xl">
                Xarajatlaringizni bir joyda kuzating
              </h1>
              <p className="soft-text mt-4 max-w-xl text-sm leading-7 sm:text-base">
                Joriy oy statistikasi, kategoriya kesimidagi tahlil va AI tavsiyalarini landing sahifasidagi
                ko'rinishga mos, toza dashboard ichida ko'ring.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="theme-chip rounded-full px-4 py-2 text-sm">
                  {now.toLocaleString('uz-UZ', { month: 'long', year: 'numeric' })}
                </div>
                <div className="theme-chip rounded-full px-4 py-2 text-sm">
                  {expenses.length} ta yozuv
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/expenses"
                className="glow-button rounded-2xl px-5 py-3 text-center text-sm font-semibold transition"
              >
                Xarajat qo'shish
              </Link>
              <Link
                to="/profile"
                className="ghost-button rounded-2xl px-5 py-3 text-center text-sm font-medium transition"
              >
                Profilni ko'rish
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Oylik jami',
              value: `${totalAmount.toLocaleString()} so'm`,
              note: "Joriy oy bo'yicha umumiy xarajat",
            },
            {
              label: 'Barcha yozuvlar',
              value: expenses.length.toLocaleString(),
              note: 'Kiritilgan jami xarajatlar soni',
            },
            {
              label: 'Faol kategoriyalar',
              value: pieData.length.toLocaleString(),
              note: "Ushbu oy ishlatilgan bo'limlar",
            },
            {
              label: "O'rtacha sarf",
              value: `${averageExpense.toLocaleString()} so'm`,
              note: "Kategoriya kesimida o'rtacha ko'rsatkich",
            },
          ].map((item) => (
            <div key={item.label} className="glass-card rounded-[28px] p-5 sm:p-6">
              <p className="text-sm font-medium theme-text-soft">{item.label}</p>
              <p className="stat-value mt-3 text-3xl font-extrabold tracking-[-0.04em]">{item.value}</p>
              <p className="soft-text mt-3 text-sm leading-6">{item.note}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card rounded-[30px] p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="panel-title text-xl">Kategoriyalar taqsimoti</h2>
                <p className="soft-text mt-2 text-sm">Qaysi yo'nalishlar ko'proq xarajat olib kelayotganini ko'ring.</p>
              </div>
            </div>

            {pieData.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
                <div className="h-[260px] sm:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${Number(value).toLocaleString()} so'm`}
                        contentStyle={{
                          backgroundColor: '#111827',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '16px',
                          color: '#fff',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {pieData.map((item, index) => (
                    <div key={item.name} className="glass-card-soft flex items-center justify-between rounded-[20px] px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="truncate text-sm font-medium theme-text">{item.name}</span>
                      </div>
                      <span className="text-sm theme-text-soft">{Number(item.value).toLocaleString()} so'm</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card-soft flex h-[280px] items-center justify-center rounded-[24px] text-center theme-text-faint">
                Hali xarajat ma'lumotlari yo'q
              </div>
            )}
          </div>

          <div className="glass-card rounded-[30px] p-5 sm:p-6">
            <h2 className="panel-title text-xl">So'nggi xarajatlar trendi</h2>
            <p className="soft-text mt-2 text-sm">Oxirgi yozuvlar kesimidagi summalar dinamikasi.</p>

            {barData.length > 0 ? (
              <div className="mt-5 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <defs>
                      <linearGradient id="dashboardBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value) => `${Number(value).toLocaleString()} so'm`}
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="amount" fill="url(#dashboardBar)" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="glass-card-soft mt-5 flex h-[320px] items-center justify-center rounded-[24px] text-center theme-text-faint">
                Grafik uchun yetarli ma'lumot yo'q
              </div>
            )}
          </div>
        </section>

        {report?.aiAnalysis && (
          <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="glass-card rounded-[30px] p-6">
              <span className="section-badge">AI Insight</span>
              <h2 className="panel-title mt-4 text-xl">AI tahlil</h2>
              <p className="soft-text mt-3 text-sm leading-7">{report.aiAnalysis}</p>
            </div>

            <div className="glass-card rounded-[30px] p-6">
              <span className="section-badge">Savings</span>
              <h2 className="panel-title mt-4 text-xl">Tejash maslahatlari</h2>
              <p className="soft-text mt-3 whitespace-pre-line text-sm leading-7">{report.savingAdvice}</p>
            </div>
          </section>
        )}

        <div className="mt-6">
          <CurrencyRates />
        </div>

        <section className="mt-6 glass-card rounded-[30px] p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="panel-title text-xl">So'nggi xarajatlar</h2>
              <p className="soft-text mt-2 text-sm">Eng oxirgi kiritilgan xarajatlar shu yerda ko'rinadi.</p>
            </div>
            <Link to="/expenses" className="ghost-button rounded-2xl px-4 py-2.5 text-center text-sm font-medium transition">
              Barchasini ko'rish
            </Link>
          </div>

          {expenses.length === 0 ? (
            <div className="glass-card-soft mt-5 flex flex-col items-center rounded-[24px] px-6 py-14 text-center">
              <div className="theme-chip rounded-full px-4 py-2 text-sm">
                Hozircha bo'sh
              </div>
              <h3 className="mt-5 text-xl font-semibold theme-text">Birinchi xarajatni qo'shing</h3>
              <p className="soft-text mt-2 max-w-md text-sm">Xarajatlar kiritilgach dashboard ichidagi barcha ko'rsatkichlar shu yerda jonlanadi.</p>
              <Link to="/expenses" className="glow-button mt-6 rounded-2xl px-5 py-3 text-sm font-semibold transition">
                Xarajat qo'shish
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div
                  key={expense.id}
                  className="glass-card-soft flex flex-col gap-4 rounded-[24px] p-4 transition hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--theme-chip-border)] text-lg theme-text"
                      style={{ backgroundColor: `${expense.categoryColor || '#6366f1'}22` }}
                    >
                      {expense.categoryIcon || '$'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold theme-text">{expense.title}</p>
                      <p className="mt-1 truncate text-xs theme-text-faint">
                        {expense.categoryName} - {expense.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                    <p className="text-base font-semibold theme-text">{Number(expense.amount).toLocaleString()} so'm</p>
                    <p className="mt-1 text-xs theme-text-subtle">Kategoriya: {expense.categoryName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
