import { useEffect, useState } from 'react';
import { fetchPlayers } from '../../api/endpoints';
import type { Player } from '../../types';
import PlayerCard from '../../components/PlayerCard';
import Reveal from '../../components/Reveal';
import { useLang } from '../../contexts/LanguageContext';

export default function PlayersIndex() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLang();

  useEffect(() => {
    fetchPlayers().then((data) => { setPlayers(data); setLoading(false); });
  }, []);

  const categories = ['all', ...new Set(players.map((p) => p.category))];
  const positions = ['all', ...new Set(players.map((p) => p.position))];

  const filtered = players.filter((p) => {
    if (filter !== 'all' && p.category !== filter) return false;
    if (positionFilter !== 'all' && p.position !== positionFilter) return false;
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <>
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="animate-page-hero text-4xl md:text-5xl font-black mb-4">{t('Nos Joueurs', 'Our Players')}</h1>
          <p className="animate-page-hero-sub text-xl text-gray-300">{t('Decouvrez les talents formes par notre centre', 'Discover the talents trained by our center')}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <Reveal>
            <div className="flex flex-wrap gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Categorie', 'Category')}</label>
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Poste', 'Position')}</label>
                <div className="flex flex-wrap gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPositionFilter(pos)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        positionFilter === pos ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {pos === 'all' ? t('Tous', 'All') : pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((player, i) => (
                <Reveal key={player.id} delay={Math.min(i * 0.08, 0.5)} direction="up">
                  <PlayerCard player={player} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">{t('Aucun joueur trouve avec ces criteres.', 'No players found with these criteria.')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
