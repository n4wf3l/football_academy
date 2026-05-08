import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const navLinks = [
  { href: '/', fr: 'Accueil', en: 'Home', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75' },
  { href: '/about', fr: 'Le Centre', en: 'About', icon: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.75a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z' },
  { href: '/players', fr: 'Joueurs', en: 'Players', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { href: '/program', fr: 'Programme', en: 'Program', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
  { href: '/gallery', fr: 'Galerie', en: 'Gallery', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
  { href: '/tournaments', fr: 'Tournois', en: 'Tournaments', icon: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0' },
  { href: '/contact', fr: 'Contact', en: 'Contact', icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
];

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { settings } = useSettings();
  const { lang, setLang, t } = useLang();
  const { user } = useAuth();
  const toast = useToast();
  const [langModalOpen, setLangModalOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y < 80) {
        setNavHidden(false);
      } else if (y > lastY + 4) {
        setNavHidden(true);
      } else if (y < lastY - 4) {
        setNavHidden(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navHidden && !mobileMenuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled || !isHome
            ? 'bg-dark/90 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)]'
            : 'bg-gradient-to-b from-black/60 to-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-[60px]' : 'h-[72px]'}`}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt="Logo"
                  className={`rounded-full object-cover transition-all duration-500 ${scrolled ? 'w-8 h-8' : 'w-9 h-9'}`}
                />
              ) : (
                <div className={`bg-primary rounded-full flex items-center justify-center font-bold text-white transition-all duration-500 ${scrolled ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-base'}`}>
                  {settings.academy_name.substring(0, 2)}
                </div>
              )}
              <span className="text-white font-semibold text-[15px] tracking-tight hidden sm:block group-hover:text-primary-light transition-colors duration-300">
                {settings.academy_name}
              </span>
            </Link>

            {/* Desktop nav - centered */}
            <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === '/'}
                  className={`relative px-3.5 py-1.5 text-[13px] font-medium tracking-wide transition-all duration-300 rounded-full ${
                    isActive(link.href)
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? link.en : link.fr}
                  {isActive(link.href) && (
                    <span className="absolute inset-0 bg-white/[0.08] rounded-full border border-white/[0.08]" />
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {/* Lang toggle */}
              <button
                onClick={() => setLangModalOpen(true)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
                title={t('Changer la langue', 'Change language')}
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
              </button>

              {/* Divider */}
              <div className="w-px h-5 bg-white/10" />

              {/* Admin CTA */}
              <Link
                to={user ? '/dashboard' : '/login'}
                className={`group flex items-center gap-2 pl-4 pr-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                  user
                    ? 'bg-white/[0.08] text-white hover:bg-white/[0.15] border border-white/[0.06]'
                    : 'bg-primary text-white hover:bg-primary-light hover:shadow-[0_0_20px_rgba(76,175,80,0.3)]'
                }`}
              >
                {user ? (
                  <svg className="w-3.5 h-3.5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
                {user ? 'Dashboard' : t('Espace Admin', 'Admin')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/[0.08] transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`absolute w-[18px] h-[1.5px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45' : '-translate-y-[5px]'}`} />
              <span className={`absolute w-[18px] h-[1.5px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
              <span className={`absolute w-[18px] h-[1.5px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45' : 'translate-y-[5px]'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Floating side rail — appears on scroll, alternative nav while navbar is hidden */}
      <aside
        className={`hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-0.5 p-1.5 rounded-full bg-dark/85 backdrop-blur-xl border border-white/[0.08] shadow-2xl transition-all duration-500 ${
          scrolled
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-8 pointer-events-none'
        }`}
        aria-label={t('Navigation rapide', 'Quick navigation')}
      >
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className="group relative w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              title={lang === 'en' ? link.en : link.fr}
            >
              {active && (
                <span className="absolute inset-0 bg-white/[0.1] rounded-full border border-white/[0.08]" />
              )}
              <svg
                className={`relative w-[17px] h-[17px] transition-colors ${
                  active ? 'text-white' : 'text-white/45 group-hover:text-white'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.7}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>

              {/* Tooltip label on hover */}
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap px-2.5 py-1 rounded-md bg-dark/95 border border-white/[0.08] text-[11px] font-medium text-white/90 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-lg">
                {lang === 'en' ? link.en : link.fr}
              </span>
            </NavLink>
          );
        })}
      </aside>

      {/* Mobile fullscreen menu — outside nav to avoid backdrop-filter containing block issue */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] flex flex-col overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Blurred background */}
        <div className="absolute inset-0 bg-dark/95 backdrop-blur-2xl" />

        {/* Close button */}
        <div className="relative flex justify-between items-center px-5 pt-5 pb-2">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-xs text-white">
                {settings.academy_name.substring(0, 2)}
              </div>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.15] transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Centered nav links */}
        <nav className="relative flex-1 flex flex-col items-center justify-center gap-1 px-8">
          {navLinks.map((link, i) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className={`w-full text-center px-6 py-3.5 rounded-2xl text-lg font-medium transition-all duration-300 ${
                isActive(link.href)
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
              }`}
              style={{
                transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: mobileMenuOpen ? 1 : 0,
                transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 50}ms`,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {lang === 'en' ? link.en : link.fr}
            </NavLink>
          ))}
        </nav>

        {/* Bottom action */}
        <div className="relative px-6 pb-8 pt-4">
          <button
            onClick={() => {
              const newLang = lang === 'fr' ? 'en' : 'fr';
              setLang(newLang);
              toast.success(
                newLang === 'fr' ? 'Langue modifiée' : 'Language changed',
                newLang === 'fr' ? 'Français activé' : 'English activated'
              );
            }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-semibold text-white/70 bg-white/[0.06] hover:bg-white/[0.12] hover:text-white transition-all duration-300 border border-white/[0.06]"
          >
            <span className="text-base leading-none">{lang === 'fr' ? '🇬🇧' : '🇫🇷'}</span>
            {lang === 'fr' ? 'English' : 'Français'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <main key={location.pathname} className="animate-page-enter">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-gray-400 animate-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-lg text-white">
                    {settings.academy_name.substring(0, 2)}
                  </div>
                )}
                <span className="text-xl font-bold text-white">{settings.academy_name}</span>
              </div>
              <p className="text-sm leading-relaxed">
                {t(
                  "Centre de formation de football d'excellence. Nous formons les joueurs et les hommes de demain à travers un programme sportif, éducatif et humain de haut niveau.",
                  "A football training center of excellence. We develop players and future leaders through a high-level sports, educational, and personal development program."
                )}
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t('Navigation', 'Navigation')}</h3>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="hover:text-white transition-colors">
                      {lang === 'en' ? link.en : link.fr}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                {settings.contact_address && <li>{settings.contact_address}</li>}
                {settings.contact_email && <li>{settings.contact_email}</li>}
                {settings.contact_phone && <li>{settings.contact_phone}</li>}
              </ul>
              <div className="flex gap-3 mt-4">
                {([
                  { key: 'social_facebook' as const, label: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { key: 'social_instagram' as const, label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                  { key: 'social_youtube' as const, label: 'YouTube', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                  { key: 'social_linkedin' as const, label: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { key: 'social_tiktok' as const, label: 'TikTok', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
                  { key: 'social_snapchat' as const, label: 'Snapchat', icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z' },
                  { key: 'social_x' as const, label: 'X', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                ]).filter((s) => settings[s.key]).map((social) => (
                  <a
                    key={social.key}
                    href={settings[social.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} {settings.academy_name}. {t('Tous droits réservés.', 'All rights reserved.')}</p>
          </div>
        </div>
      </footer>

      {/* Language modal */}
      {langModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]" onClick={() => setLangModalOpen(false)} />
          <div className="relative w-full max-w-sm mx-4 rounded-3xl shadow-2xl border overflow-hidden bg-white border-gray-100 animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 text-center border-b border-gray-100">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {t('Choisir la langue', 'Choose language')}
              </h3>
              <p className="text-sm mt-1 text-gray-500">
                {t('Sélectionnez votre langue préférée', 'Select your preferred language')}
              </p>
            </div>

            {/* Options */}
            <div className="p-4 space-y-2">
              {[
                { code: 'fr' as const, flag: '🇫🇷', name: 'Français', sub: 'French' },
                { code: 'en' as const, flag: '🇬🇧', name: 'English', sub: 'Anglais' },
              ].map((option) => (
                <button
                  key={option.code}
                  onClick={() => {
                    setLang(option.code);
                    setLangModalOpen(false);
                    toast.success(
                      option.code === 'fr' ? 'Langue modifiée' : 'Language changed',
                      option.code === 'fr' ? 'La langue a été changée en Français' : 'Language has been changed to English'
                    );
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                    lang === option.code
                      ? 'bg-primary/10 ring-2 ring-primary/30'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl leading-none">{option.flag}</span>
                  <div className="text-left flex-1">
                    <p className={`font-semibold text-[15px] ${
                      lang === option.code ? 'text-primary' : 'text-gray-900'
                    }`}>{option.name}</p>
                    <p className="text-xs text-gray-400">{option.sub}</p>
                  </div>
                  {lang === option.code && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setLangModalOpen(false)}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {t('Fermer', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
