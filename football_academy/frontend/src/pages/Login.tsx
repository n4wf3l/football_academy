import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuth();
  const { settings } = useSettings();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErrors({});
    try {
      const data = await login(form);
      setAuth(data.user, data.token);
      toast.success('Connexion réussie', `Bienvenue, ${data.user.name}`);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
      toast.error('Échec de connexion', 'Email ou mot de passe incorrect');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen relative flex overflow-hidden">
      {/* Left panel - visual */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-dark items-center justify-center overflow-hidden">
        {/* Animated bg shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-dark/40 via-dark to-dark" />
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-light/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md px-12">
          <div className="flex items-center gap-3 mb-10 animate-login-left" style={{ animationDelay: '0.1s' }}>
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-bold text-white text-lg">
                {settings.academy_name.substring(0, 2)}
              </div>
            )}
            <span className="text-white/90 text-xl font-semibold tracking-tight">{settings.academy_name}</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4 animate-login-left" style={{ animationDelay: '0.25s' }}>
            Gérez votre<br />
            <span className="text-primary-light">centre de formation</span>
          </h1>
          <p className="text-white/40 text-base leading-relaxed mb-10 animate-login-left" style={{ animationDelay: '0.4s' }}>
            Accédez à votre tableau de bord pour gérer joueurs, planning, galerie, tournois et plus encore.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['Joueurs', 'Planning', 'Galerie', 'Tournois', 'Partenaires', 'Paramètres'].map((f, i) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.06] text-white/50 border border-white/[0.06] animate-login-left"
                style={{ animationDelay: `${0.5 + i * 0.06}s` }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center bg-[#fafafa] relative px-6">
        {/* Subtle bg decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/[0.02] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-[400px] relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10 animate-login-right" style={{ animationDelay: '0.1s' }}>
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white">
                {settings.academy_name.substring(0, 2)}
              </div>
            )}
            <span className="text-gray-900 text-lg font-semibold">{settings.academy_name}</span>
          </div>

          {/* Header */}
          <div className="mb-8 animate-login-right" style={{ animationDelay: '0.15s' }}>
            <h2 className="text-[26px] font-bold text-gray-900 tracking-tight">Connexion</h2>
            <p className="text-gray-400 text-sm mt-1.5">Entrez vos identifiants pour accéder au dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative animate-login-right" style={{ animationDelay: '0.25s' }}>
              <label className={`absolute left-3.5 transition-all duration-200 pointer-events-none ${
                focused === 'email' || form.email
                  ? 'top-2 text-[10px] font-semibold tracking-wide uppercase text-primary'
                  : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
              }`}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                className={`w-full bg-white rounded-xl px-3.5 pt-6 pb-2 text-[15px] text-gray-900 outline-none transition-all duration-200 border ${
                  errors.email
                    ? 'border-red-400 ring-2 ring-red-100'
                    : focused === 'email'
                      ? 'border-primary/40 ring-2 ring-primary/10 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {errors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative animate-login-right" style={{ animationDelay: '0.35s' }}>
              <label className={`absolute left-3.5 transition-all duration-200 pointer-events-none ${
                focused === 'password' || form.password
                  ? 'top-2 text-[10px] font-semibold tracking-wide uppercase text-primary'
                  : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
              }`}>
                Mot de passe
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                className={`w-full bg-white rounded-xl px-3.5 pt-6 pb-2 pr-12 text-[15px] text-gray-900 outline-none transition-all duration-200 border ${
                  errors.password
                    ? 'border-red-400 ring-2 ring-red-100'
                    : focused === 'password'
                      ? 'border-primary/40 ring-2 ring-primary/10 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {errors.password[0]}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="animate-login-right" style={{ animationDelay: '0.45s' }}>
              <button
                type="submit"
                disabled={sending}
                className="relative w-full bg-primary hover:bg-primary-light text-white py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className={`inline-flex items-center gap-2 transition-all duration-300 ${sending ? 'opacity-0' : 'opacity-100'}`}>
                  Se connecter
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                {sending && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7 animate-login-right" style={{ animationDelay: '0.55s' }}>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-300 uppercase tracking-widest font-medium">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Bottom links */}
          <div className="text-center space-y-3 animate-login-right" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-gray-400">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary font-semibold hover:text-primary-light transition-colors">
                Créer un compte
              </Link>
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-gray-500 transition-colors group"
            >
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
