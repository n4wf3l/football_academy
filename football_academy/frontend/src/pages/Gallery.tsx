import { useEffect, useState } from 'react';
import { fetchGallery } from '../api/endpoints';
import type { GalleryItem } from '../types';

export default function Gallery() {
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
          <h1 className="text-4xl md:text-5xl font-black mb-4">Galerie Media</h1>
          <p className="text-xl text-gray-300">Photos et videos de notre centre et de nos joueurs</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {['all', 'photo', 'video'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    typeFilter === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t === 'all' ? 'Tout' : t === 'photo' ? 'Photos' : 'Videos'}
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
                    {cat === 'all' ? 'Toutes' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  {item.type === 'photo' ? (
                    <img src={item.file_path} alt={item.title_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                    <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-medium text-sm">{item.title_fr}</p>
                      <p className="text-xs text-gray-300">{item.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">La galerie sera bientot disponible.</p>
              <p className="text-gray-400 text-sm mt-2">Photos et videos a venir...</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
