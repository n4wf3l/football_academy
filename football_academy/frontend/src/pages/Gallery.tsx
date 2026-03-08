import { useEffect, useState } from 'react';
import { fetchGallery } from '../api/endpoints';
import type { GalleryItem } from '../types';
import Reveal from '../components/Reveal';
import { useLang } from '../contexts/LanguageContext';

export default function Gallery() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery().then((data) => { setItems(data); setLoading(false); });
  }, []);

  const categories = ['all', ...new Set(items.map((i) => i.category))];
  const filtered = items.filter((i) => {
    if (filter !== 'all' && i.category !== filter) return false;
    if (typeFilter !== 'all' && i.type !== typeFilter) return false;
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <>
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="animate-page-hero text-4xl md:text-5xl font-black mb-4">{t('Galerie Media', 'Media Gallery')}</h1>
          <p className="animate-page-hero-sub text-xl text-gray-300">{t('Photos et videos de notre centre et de nos joueurs', 'Photos and videos of our center and players')}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {['all', 'photo', 'video'].map((tp) => (
                  <button
                    key={tp}
                    onClick={() => setTypeFilter(tp)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      typeFilter === tp ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tp === 'all' ? t('Tout', 'All') : tp === 'photo' ? 'Photos' : t('Videos', 'Videos')}
                  </button>
                ))}
              </div>
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat === 'all' ? t('Toutes', 'All') : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item, i) => (
                <Reveal key={item.id} delay={Math.min(i * 0.08, 0.5)} direction="up">
                  <div className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
                    {item.type === 'photo' ? (
                      <img src={item.file_path} alt={lang === 'en' ? item.title_en : item.title_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                      <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="font-medium text-sm">{lang === 'en' ? item.title_en : item.title_fr}</p>
                        <p className="text-xs text-gray-300">{item.category}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t('La galerie sera bientot disponible.', 'Gallery coming soon.')}</p>
              <p className="text-gray-400 text-sm mt-2">{t('Photos et videos a venir...', 'Photos and videos coming soon...')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
