import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LanguageContext';
import { logout as logoutApi } from '../api/endpoints';
import { useToast } from '../contexts/ToastContext';

type SidebarMode = 'open' | 'closed' | 'hover';

const sidebarLinks = [
  { href: '/dashboard', label: 'Tableau de bord', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { href: '/dashboard/players', label: 'Joueurs', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { href: '/dashboard/planning', label: 'Planning', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/dashboard/gallery', label: 'Galerie', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/dashboard/tournaments', label: 'Tournois', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { href: '/dashboard/partners', label: 'Partenaires', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
  { href: '/dashboard/staff', label: 'Encadrement', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/dashboard/categories', label: 'Catégories', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
  { href: '/dashboard/settings', label: 'Paramètres', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function AdminLayout() {
  const { user, clearAuth } = useAuth();
  const { settings } = useSettings();
  const { isDark, toggle } = useTheme();
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(() => {
    return (localStorage.getItem('sidebar-mode') as SidebarMode) || 'open';
  });
  const [hovered, setHovered] = useState(false);
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [bugMessage, setBugMessage] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('sidebar-mode', sidebarMode);
  }, [sidebarMode]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (sidebarMenuRef.current && !sidebarMenuRef.current.contains(e.target as Node)) setSidebarMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const expanded = sidebarMode === 'open' || (sidebarMode === 'hover' && hovered);
  const sidebarW = expanded ? 'w-64' : 'w-[72px]';
  const contentML = expanded ? 'ml-64' : 'ml-[72px]';

  const handleLogout = async () => {
    try { await logoutApi(); } catch {}
    clearAuth();
    toast.info('Déconnexion', 'À bientôt !');
    navigate('/login');
  };

  const handleReportBug = () => {
    setBugMessage('');
    setBugModalOpen(true);
  };

  const sendBugReport = () => {
    if (!bugMessage.trim()) return;
    const subject = encodeURIComponent(`[Bug] Problème technique - ${settings.academy_name}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nJe rencontre un problème technique sur la plateforme.\n\n` +
      `--- Détails ---\n` +
      `Page : ${location.pathname}\n` +
      `Utilisateur : ${user?.name} (${user?.email})\n` +
      `Date : ${new Date().toLocaleString('fr-FR')}\n` +
      `Navigateur : ${navigator.userAgent}\n\n` +
      `Description du problème :\n${bugMessage}\n\n` +
      `Cordialement`
    );
    window.open(`mailto:${settings.contact_email}?subject=${subject}&body=${body}`, '_blank');
    setBugModalOpen(false);
    setBugMessage('');
    toast.success(t('Rapport envoyé', 'Report sent'), t('Merci pour votre retour !', 'Thanks for your feedback!'));
  };

  const modeIcons: Record<SidebarMode, { icon: string; label: string }> = {
    open: { icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5', label: t('Toujours ouvert', 'Always open') },
    closed: { icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12', label: t('Toujours fermé', 'Always closed') },
    hover: { icon: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9', label: t('Ouvrir au survol', 'Open on hover') },
  };

  const topBtnCls = `p-2 rounded-lg transition-all duration-200 ${
    isDark
      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
  }`;

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950' : 'bg-gray-50/80'}`}>
      {/* Sidebar */}
      <aside
        onMouseEnter={() => sidebarMode === 'hover' && setHovered(true)}
        onMouseLeave={() => { setHovered(false); setSidebarMenuOpen(false); }}
        className={`${sidebarW} flex flex-col fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-out ${
          isDark ? 'bg-slate-900 border-r border-slate-800' : 'bg-dark text-white'
        }`}
      >
        {/* Logo */}
        <div className={`h-14 flex items-center gap-3 px-4 border-b shrink-0 ${isDark ? 'border-slate-800' : 'border-white/10'}`}>
          <Link to="/" className="flex items-center gap-3 min-w-0">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0">
                {settings.academy_name.substring(0, 2)}
              </div>
            )}
            {expanded && (
              <span className="font-bold text-sm leading-tight text-white truncate">{settings.academy_name}</span>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {sidebarLinks.map((link, i) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/dashboard'}
              title={!expanded ? link.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 animate-admin-nav-item ${
                  expanded ? '' : 'justify-center'
                } ${
                  isActive
                    ? 'bg-primary text-white'
                    : isDark
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`
              }
              style={{ animationDelay: `${0.05 * (i + 1)}s` }}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
              </svg>
              {expanded && <span className="truncate">{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: back to site + user */}
        <div className={`border-t p-3 space-y-2 shrink-0 ${isDark ? 'border-slate-800' : 'border-white/10'}`}>
          <Link
            to="/"
            title={!expanded ? t('Retour au site', 'Back to site') : undefined}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              expanded ? '' : 'justify-center'
            } ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {expanded && t('Retour au site', 'Back to site')}
          </Link>
          {expanded && (
            <div className="px-3 pt-1">
              <p className="text-sm font-medium truncate text-white">{user?.name}</p>
              <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{user?.email}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className={`flex-1 ${contentML} transition-all duration-300 ease-out flex flex-col min-h-screen`}>
        {/* Top bar */}
        <header className={`h-14 flex items-center justify-between px-5 border-b shrink-0 sticky top-0 z-30 backdrop-blur-lg ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-gray-50/80 border-gray-200'
        }`}>
          {/* Left: page breadcrumb or empty */}
          <div className="flex items-center gap-3">
            {/* Could add breadcrumbs here later */}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            {/* Report bug */}
            <button
              onClick={handleReportBug}
              title={t('Signaler un problème', 'Report an issue')}
              className={topBtnCls}
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152-6.135l-.003-.065a.857.857 0 00-.244-.567 8.21 8.21 0 00-.598-.543M12 12.75c-2.883 0-5.647.508-8.208 1.44.125-2.105.554-4.154 1.253-6.1l-.003-.065a.857.857 0 01.244-.567c.178-.183.37-.354.572-.519M12 12.75V6.108m0 0c1.47 0 2.878-.265 4.18-.748M12 6.108c-1.47 0-2.878-.265-4.18-.748m0 0C6.093 4.642 4.652 3.545 3.8 2.1m4.02 3.26C9.278 6.128 10.608 6.75 12 6.75c1.392 0 2.722-.622 4.18-1.39m0 0C17.908 4.642 19.348 3.545 20.2 2.1" />
              </svg>
            </button>

            {/* Sidebar mode */}
            <div className="relative" ref={sidebarMenuRef}>
              <button
                onClick={() => setSidebarMenuOpen(!sidebarMenuOpen)}
                title={t('Mode sidebar', 'Sidebar mode')}
                className={topBtnCls}
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              {sidebarMenuOpen && (
                <div className={`absolute right-0 top-full mt-1.5 w-52 rounded-xl shadow-xl border overflow-hidden z-50 ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`px-3 py-2 text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                    Sidebar
                  </div>
                  {(Object.keys(modeIcons) as SidebarMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { setSidebarMode(mode); setSidebarMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                        sidebarMode === mode
                          ? 'bg-primary text-white'
                          : isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={modeIcons[mode].icon} />
                      </svg>
                      {modeIcons[mode].label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
              className={`${topBtnCls} text-xs font-bold w-8 h-8 flex items-center justify-center`}
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Dark/Light mode */}
            <button
              onClick={toggle}
              title={isDark ? t('Mode clair', 'Light mode') : t('Mode sombre', 'Dark mode')}
              className={topBtnCls}
            >
              {isDark ? (
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Separator */}
            <div className={`w-px h-6 mx-1 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg transition-all duration-200 ${
                  isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  {user?.name}
                </span>
                <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''} ${isDark ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className={`absolute right-0 top-full mt-1.5 w-56 rounded-xl shadow-xl border overflow-hidden z-50 ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                        isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                      </svg>
                      {t('Paramètres', 'Settings')}
                    </Link>
                    <button
                      onClick={handleReportBug}
                      className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                        isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      {t('Signaler un problème', 'Report an issue')}
                    </button>
                  </div>
                  <div className={`border-t py-1 ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                    <button
                      onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                        isDark ? 'text-red-400 hover:bg-slate-700' : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('Déconnexion', 'Logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div key={location.pathname} className={`flex-1 animate-admin-content ${isDark ? 'admin-dark' : ''}`}>
          <Outlet />
        </div>
      </div>

      {/* Bug report modal */}
      {bugModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBugModalOpen(false)} />
          <div className={`relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl border p-6 animate-admin-fade ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('Signaler un problème', 'Report an issue')}
            </h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {t('Décrivez le problème rencontré', 'Describe the issue you encountered')}
            </p>
            <textarea
              autoFocus
              value={bugMessage}
              onChange={(e) => setBugMessage(e.target.value)}
              placeholder={t('Décrivez votre problème ici...', 'Describe your issue here...')}
              rows={5}
              className={`w-full rounded-xl border px-4 py-3 text-sm resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setBugModalOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t('Annuler', 'Cancel')}
              </button>
              <button
                onClick={sendBugReport}
                disabled={!bugMessage.trim()}
                className={`px-5 py-2 rounded-lg text-sm font-medium text-white transition-all ${
                  bugMessage.trim()
                    ? 'bg-primary hover:opacity-90'
                    : 'bg-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                {t('Envoyer', 'Send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
