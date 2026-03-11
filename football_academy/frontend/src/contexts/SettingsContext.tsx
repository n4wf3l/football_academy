import { createContext, useContext, useState, useEffect } from 'react';
import type { SiteSettings } from '../types';
import { fetchSettings } from '../api/endpoints';

const defaults: SiteSettings = {
  academy_name: 'Football Academy',
  logo_url: '',
  primary_color: '#1B5E20',
  primary_light_color: '#4CAF50',
  primary_dark_color: '#0D3B0F',
  accent_color: '#FFD700',
  dark_color: '#1a1a2e',
  hero_image_url: '/group-players.jpg',
  hero_title: 'Former les champions de demain',
  hero_subtitle: "Notre centre de formation combine excellence sportive, éducation et développement personnel pour préparer les jeunes talents au plus haut niveau du football professionnel.",
  hero_badge: "Centre de Formation d'Excellence",
  hero_video_url: '',
  contact_email: 'contact@football-academy.com',
  contact_phone: '+32 XXX XXX XXX',
  contact_address: '',
  social_facebook: '',
  social_instagram: '',
  social_youtube: '',
  social_linkedin: '',
  social_tiktok: '',
  social_snapchat: '',
  social_x: '',
};

interface SettingsContextType {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaults,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [ready, setReady] = useState(false);

  const refreshSettings = async () => {
    try {
      const data = await fetchSettings();
      setSettings({ ...defaults, ...data });
      applyColors({ ...defaults, ...data });
    } catch {
      applyColors(defaults);
    }
    setReady(true);
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

function applyColors(s: SiteSettings) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', s.primary_color);
  root.style.setProperty('--color-primary-light', s.primary_light_color);
  root.style.setProperty('--color-primary-dark', s.primary_dark_color);
  root.style.setProperty('--color-accent', s.accent_color);
  root.style.setProperty('--color-dark', s.dark_color);

  document.title = s.academy_name || 'Football Academy';

  if (s.logo_url) {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = s.logo_url;
  }
}

export const useSettings = () => useContext(SettingsContext);
