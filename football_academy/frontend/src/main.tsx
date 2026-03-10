import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminFab from './components/AdminFab'
import Home from './pages/Home'
import About from './pages/About'
import PlayersIndex from './pages/Players/Index'
import PlayerShow from './pages/Players/Show'
import Gallery from './pages/Gallery'
import Program from './pages/Program'
import Tournaments from './pages/Tournaments'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Settings from './pages/admin/Settings'
import AdminPlayers from './pages/admin/Players'
import AdminPlanning from './pages/admin/Planning'
import AdminGallery from './pages/admin/Gallery'
import AdminTournaments from './pages/admin/Tournaments'
import AdminPartners from './pages/admin/Partners'
import AdminStaff from './pages/admin/Staff'
import AdminCategories from './pages/admin/Categories'
import ScrollToTop from './components/ScrollToTop'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <LanguageProvider>
        <ToastProvider>
        <ThemeProvider>
        <SettingsProvider>
          <Routes>
            {/* Public pages with layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/players" element={<PlayersIndex />} />
              <Route path="/players/:id" element={<PlayerShow />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/program" element={<Program />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Auth pages (no layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin pages with sidebar layout */}
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/players" element={<AdminPlayers />} />
              <Route path="/dashboard/planning" element={<AdminPlanning />} />
              <Route path="/dashboard/gallery" element={<AdminGallery />} />
              <Route path="/dashboard/tournaments" element={<AdminTournaments />} />
              <Route path="/dashboard/partners" element={<AdminPartners />} />
              <Route path="/dashboard/staff" element={<AdminStaff />} />
              <Route path="/dashboard/categories" element={<AdminCategories />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>
          </Routes>

          {/* Floating admin button (visible on public pages when logged in) */}
          <AdminFab />
        </SettingsProvider>
        </ThemeProvider>
        </ToastProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
