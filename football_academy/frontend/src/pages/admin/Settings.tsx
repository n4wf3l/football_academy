import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { fetchSettings, updateSettings, uploadFile } from '../../api/endpoints';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';
import type { SiteSettings } from '../../types';

export default function Settings() {
  const { refreshSettings } = useSettings();
  const toast = useToast();
  const { isDark } = useTheme();
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const { url } = await uploadFile(file);
      setForm((prev) => ({ ...prev, logo_url: url }));
    } catch {}
    setUploadingLogo(false);
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      const { url } = await uploadFile(file);
      setForm((prev) => ({ ...prev, hero_image_url: url }));
    } catch {}
    setUploadingHero(false);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings().then((data) => {
      setForm(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateSettings(form);
      setForm(updated);
      await refreshSettings();
      setSaved(true);
      toast.success('Paramètres sauvegardés', 'Les modifications ont été appliquées');
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error('Erreur', 'Impossible de sauvegarder les paramètres');
    }
    setSaving(false);
  };

  const set = (key: keyof SiteSettings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Style helpers
  const card = isDark
    ? 'bg-slate-900 border-slate-800'
    : 'bg-white border-gray-100';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const inputCls = isDark
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary focus:border-transparent'
    : 'bg-white border-gray-300 text-gray-900 focus:ring-primary focus:border-transparent';
  const labelCls = isDark ? 'text-slate-300' : 'text-gray-700';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Sticky header with save button */}
      <div className={`sticky top-0 z-30 border-b px-6 lg:px-8 py-4 backdrop-blur-lg ${
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-gray-50/80 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${text}`}>Paramètres du site</h1>
            <p className={`text-sm mt-0.5 ${textMuted}`}>Personnalisez l'apparence et le contenu de votre site</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg ${
              saved
                ? 'bg-green-500 text-white shadow-green-500/25'
                : 'bg-primary hover:bg-primary-dark text-white shadow-primary/25 hover:shadow-primary/40'
            } disabled:opacity-50`}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sauvegarde...
              </span>
            ) : saved ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Sauvegardé !
              </span>
            ) : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-6 animate-admin-fade" style={{ animationDelay: '0.05s' }}>
        {/* Row 1: Identity + Colors */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Identity */}
          <div className={`rounded-2xl shadow-sm border p-6 ${card}`}>
            <h2 className={`text-lg font-bold mb-5 flex items-center gap-2 ${text}`}>
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Identité
            </h2>
            <div className="space-y-5">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Nom de l'académie</label>
                <input
                  type="text"
                  value={form.academy_name || ''}
                  onChange={(e) => set('academy_name', e.target.value)}
                  className={`w-full rounded-xl px-4 py-2.5 border outline-none transition-all ${inputCls}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelCls}`}>Logo</label>
                <div className="flex items-center gap-5">
                  <div className={`w-20 h-20 rounded-xl border-2 border-dashed overflow-hidden flex-shrink-0 flex items-center justify-center ${
                    isDark ? 'bg-slate-800 border-slate-600' : 'bg-gray-100 border-gray-300'
                  }`}>
                    {form.logo_url ? (
                      <img src={form.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                    ) : (
                      <svg className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input type="file" ref={logoRef} accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <button
                      type="button"
                      onClick={() => logoRef.current?.click()}
                      disabled={uploadingLogo}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {uploadingLogo ? 'Upload en cours...' : 'Importer un fichier'}
                    </button>
                    {form.logo_url && (
                      <button
                        type="button"
                        onClick={() => set('logo_url', '')}
                        className="ml-2 text-red-500 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    )}
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>JPG, PNG, SVG ou WebP. Max 5 MB.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className={`rounded-2xl shadow-sm border p-6 ${card}`}>
            <h2 className={`text-lg font-bold mb-5 flex items-center gap-2 ${text}`}>
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Couleurs du thème
            </h2>
            {/* Mode presets */}
            <div className="flex gap-3 mb-5">
              <button
                type="button"
                onClick={() => setForm((prev) => ({
                  ...prev,
                  primary_color: '#1B5E20',
                  primary_light_color: '#4CAF50',
                  primary_dark_color: '#0D3B0F',
                  accent_color: '#FFD700',
                  dark_color: '#1a1a2e',
                }))}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-colors flex-1 ${
                  isDark ? 'border-slate-700 hover:border-primary' : 'border-gray-200 hover:border-primary'
                }`}
              >
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full bg-[#1B5E20]" />
                  <div className="w-4 h-4 rounded-full bg-[#4CAF50]" />
                </div>
                <div className="text-left">
                  <p className={`text-xs font-semibold ${text}`}>Sombre / Vert</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({
                  ...prev,
                  primary_color: '#2563EB',
                  primary_light_color: '#60A5FA',
                  primary_dark_color: '#1D4ED8',
                  accent_color: '#F59E0B',
                  dark_color: '#F8FAFC',
                }))}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-colors flex-1 ${
                  isDark ? 'border-slate-700 hover:border-primary' : 'border-gray-200 hover:border-primary'
                }`}
              >
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full bg-[#2563EB]" />
                  <div className="w-4 h-4 rounded-full bg-[#60A5FA]" />
                </div>
                <div className="text-left">
                  <p className={`text-xs font-semibold ${text}`}>Clair / Bleu</p>
                </div>
              </button>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              {([
                { key: 'primary_color' as const, label: 'Principale' },
                { key: 'primary_light_color' as const, label: 'Claire' },
                { key: 'primary_dark_color' as const, label: 'Foncée' },
                { key: 'accent_color' as const, label: 'Accent' },
                { key: 'dark_color' as const, label: 'Sombre' },
              ]).map((item) => (
                <div key={item.key}>
                  <label className={`block text-xs font-medium mb-1 ${labelCls}`}>{item.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form[item.key] || '#000000'}
                      onChange={(e) => set(item.key, e.target.value)}
                      className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={form[item.key] || ''}
                      onChange={(e) => set(item.key, e.target.value)}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-mono border outline-none transition-all ${inputCls}`}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Color preview */}
            <div className={`mt-4 p-3 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              <p className={`text-xs mb-2 ${textMuted}`}>Aperçu</p>
              <div className="flex gap-2">
                {[
                  { key: 'primary_color' as const, label: 'Principale' },
                  { key: 'primary_light_color' as const, label: 'Claire' },
                  { key: 'primary_dark_color' as const, label: 'Foncée' },
                  { key: 'accent_color' as const, label: 'Accent' },
                  { key: 'dark_color' as const, label: 'Sombre' },
                ].map((c) => (
                  <div key={c.key} className="text-center flex-1">
                    <div className="w-full h-10 rounded-lg shadow-sm" style={{ backgroundColor: form[c.key] || '#000' }} />
                    <span className={`text-[10px] mt-1 block ${textMuted}`}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Hero Section (full width) */}
        <div className={`rounded-2xl shadow-sm border p-6 ${card}`}>
          <h2 className={`text-lg font-bold mb-5 flex items-center gap-2 ${text}`}>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Section Hero (page d'accueil)
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: text fields */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Badge (étiquette)</label>
                <input
                  type="text"
                  value={form.hero_badge || ''}
                  onChange={(e) => set('hero_badge', e.target.value)}
                  className={`w-full rounded-xl px-4 py-2.5 border outline-none transition-all ${inputCls}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Titre principal</label>
                <input
                  type="text"
                  value={form.hero_title || ''}
                  onChange={(e) => set('hero_title', e.target.value)}
                  className={`w-full rounded-xl px-4 py-2.5 border outline-none transition-all ${inputCls}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Sous-titre</label>
                <textarea
                  value={form.hero_subtitle || ''}
                  onChange={(e) => set('hero_subtitle', e.target.value)}
                  rows={3}
                  className={`w-full rounded-xl px-4 py-2.5 border outline-none transition-all resize-none ${inputCls}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Vidéo de présentation (URL YouTube embed)</label>
                <input
                  type="text"
                  value={form.hero_video_url || ''}
                  onChange={(e) => set('hero_video_url', e.target.value)}
                  className={`w-full rounded-xl px-4 py-2.5 border outline-none transition-all ${inputCls}`}
                  placeholder="https://www.youtube.com/embed/..."
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Cette vidéo sera affichée sur la page d'accueil.</p>
              </div>
            </div>
            {/* Right: image */}
            <div className="space-y-4">
              <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Image de fond</label>
              <div className={`rounded-xl border-2 border-dashed overflow-hidden ${
                isDark ? 'border-slate-700' : 'border-gray-200'
              }`}>
                {form.hero_image_url ? (
                  <img src={form.hero_image_url} alt="Hero preview" className="w-full h-48 object-cover" />
                ) : (
                  <div className={`w-full h-48 flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                    <svg className={`w-12 h-12 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input type="file" ref={heroRef} accept="image/*" className="hidden" onChange={handleHeroUpload} />
                <button
                  type="button"
                  onClick={() => heroRef.current?.click()}
                  disabled={uploadingHero}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {uploadingHero ? 'Upload en cours...' : 'Importer une image'}
                </button>
                <span className={`text-xs ${textMuted}`}>ou</span>
                <input
                  type="text"
                  value={form.hero_image_url || ''}
                  onChange={(e) => set('hero_image_url', e.target.value)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm border outline-none transition-all ${inputCls}`}
                  placeholder="Coller une URL..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Contact + Social */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className={`rounded-2xl shadow-sm border p-6 ${card}`}>
            <h2 className={`text-lg font-bold mb-5 flex items-center gap-2 ${text}`}>
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Informations de contact
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Email</label>
                <input
                  type="email"
                  value={form.contact_email || ''}
                  onChange={(e) => set('contact_email', e.target.value)}
                  className={`w-full rounded-xl px-4 py-2.5 border outline-none transition-all ${inputCls}`}
                  placeholder="contact@académie.com"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Téléphone</label>
                <input
                  type="text"
                  value={form.contact_phone || ''}
                  onChange={(e) => set('contact_phone', e.target.value)}
                  className={`w-full rounded-xl px-4 py-2.5 border outline-none transition-all ${inputCls}`}
                  placeholder="+32 XXX XXX XXX"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Adresse du centre de formation</label>
                <textarea
                  value={form.contact_address || ''}
                  onChange={(e) => set('contact_address', e.target.value)}
                  rows={3}
                  className={`w-full rounded-xl px-4 py-2.5 border outline-none transition-all resize-none ${inputCls}`}
                  placeholder="Rue, ville, code postal, pays..."
                />
              </div>
            </div>
          </div>

          {/* Social Networks */}
          <div className={`rounded-2xl shadow-sm border p-6 ${card}`}>
            <h2 className={`text-lg font-bold mb-3 flex items-center gap-2 ${text}`}>
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Réseaux sociaux
            </h2>
            <p className={`text-xs mb-4 ${textMuted}`}>Collez l'URL de vos profils. Laissez vide pour masquer.</p>
            <div className="space-y-2.5">
              {([
                { key: 'social_facebook' as const, label: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', color: '#1877F2' },
                { key: 'social_instagram' as const, label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', color: '#E4405F' },
                { key: 'social_youtube' as const, label: 'YouTube', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z', color: '#FF0000' },
                { key: 'social_linkedin' as const, label: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', color: '#0A66C2' },
                { key: 'social_tiktok' as const, label: 'TikTok', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z', color: '#000000' },
                { key: 'social_snapchat' as const, label: 'Snapchat', icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z', color: '#FFFC00' },
                { key: 'social_x' as const, label: 'X (Twitter)', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', color: '#000000' },
              ]).map((social) => (
                <div key={social.key} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: social.color + '15' }}>
                    <svg className="w-4 h-4" fill={social.color} viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={form[social.key] || ''}
                    onChange={(e) => set(social.key, e.target.value)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm border outline-none transition-all ${inputCls}`}
                    placeholder={`URL ${social.label}...`}
                  />
                  {form[social.key] && (
                    <button
                      type="button"
                      onClick={() => set(social.key, '')}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Retirer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
