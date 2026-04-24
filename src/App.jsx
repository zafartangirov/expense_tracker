import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'
import GitHubCallback from './pages/GitHubCallback'
import ForgotPassword from './pages/ForgotPassword'
import VerifyEmail from './pages/VerifyEmail'
import Landing from './pages/Landing'



export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      // "/" route da login qilgan ham ko'ra olsin
<Route path="/" element={<Landing />} />
<Route path="/dashboard" element={
  <PrivateRoute><Dashboard /></PrivateRoute>
} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/" element={
        <PrivateRoute><Dashboard /></PrivateRoute>
      } />
      <Route path="/expenses" element={
        <PrivateRoute><Expenses /></PrivateRoute>
      } />
      // Routes ichiga qo'shing:
<Route path="/profile" element={
  <PrivateRoute><Profile /></PrivateRoute>
} />
<Route path="/github/callback" element={<GitHubCallback />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/verify-email" element={<VerifyEmail />} />
    </Routes>
  )
}
