import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { logout as logoutApi } from '../api/endpoints';
import { useToast } from '../contexts/ToastContext';

const sidebarLinks = [
  { href: '/dashboard', label: 'Tableau de bord', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { href: '/dashboard/players', label: 'Joueurs', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { href: '/dashboard/planning', label: 'Planning', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/dashboard/gallery', label: 'Galerie', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/dashboard/tournaments', label: 'Tournois', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { href: '/dashboard/partners', label: 'Partenaires', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
  { href: '/dashboard/staff', label: 'Encadrement', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/dashboard/categories', label: 'Categories', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
  { href: '/dashboard/settings', label: 'Parametres', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function AdminLayout() {
  const { user, clearAuth } = useAuth();
  const { settings } = useSettings();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try { await logoutApi(); } catch {}
    clearAuth();
    toast.info('Deconnexion', 'A bientot !');
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950' : 'bg-gray-50/80'}`}>
      {/* Sidebar */}
      <aside className={`w-64 flex flex-col fixed inset-y-0 left-0 z-40 ${
        isDark ? 'bg-slate-900 border-r border-slate-800' : 'bg-dark text-white'
      }`}>
        {/* Logo */}
        <div className={`h-16 flex items-center gap-3 px-5 border-b ${isDark ? 'border-slate-800' : 'border-white/10'}`}>
          <Link to="/" className="flex items-center gap-3">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center font-bold text-sm text-white">
                {settings.academy_name.substring(0, 2)}
              </div>
            )}
            <span className="font-bold text-sm leading-tight text-white">{settings.academy_name}</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : isDark
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
              </svg>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: theme toggle + user + logout */}
        <div className={`border-t p-4 ${isDark ? 'border-slate-800' : 'border-white/10'}`}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-3 transition-colors ${
              isDark
                ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
            {isDark ? 'Mode clair' : 'Mode sombre'}
          </button>

          <Link to="/" className={`flex items-center gap-2 text-sm mb-3 transition-colors ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-white'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au site
          </Link>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-white">{user?.name}</p>
              <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
              title="Deconnexion"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 ml-64 ${isDark ? 'admin-dark' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}
