import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPlayer } from '../../api/endpoints';
import type { Player } from '../../types';

export default function PlayerShow() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (id) fetchPlayer(Number(id)).then(setPlayer);
  }, [id]);

  if (!player) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  const age = new Date().getFullYear() - new Date(player.date_of_birth).getFullYear();

  return (
    <>
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/players" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
            &larr; Retour aux joueurs
          </Link>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Photo */}
            <div className="md:col-span-1">
              <div className="aspect-3/4 bg-gradient-to-br from-primary-dark to-primary rounded-2xl overflow-hidden shadow-xl">
                {player.photo ? (
                  <img src={player.photo} alt={`${player.first_name} ${player.last_name}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-32 h-32 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <div className="inline-block bg-accent text-black px-3 py-1 rounded-full text-sm font-bold mb-4">
                {player.position}
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                {player.first_name} {player.last_name}
              </h1>
              <p className="text-gray-500 text-lg mb-8">{player.category} | {player.nationality}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Age', value: `${age} ans` },
                  { label: 'Taille', value: player.height ? `${player.height} cm` : '-' },
                  { label: 'Poids', value: player.weight ? `${player.weight} kg` : '-' },
                  { label: 'Pied fort', value: player.preferred_foot === 'right' ? 'Droit' : 'Gauche' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-sm text-gray-500">{stat.label}</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{stat.value}</div>
                  </div>
                ))}
              </div>

              {player.matches_played > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Matchs joues', value: player.matches_played, color: 'text-blue-600' },
                      { label: 'Buts', value: player.goals, color: 'text-green-600' },
                      { label: 'Passes decisives', value: player.assists, color: 'text-orange-600' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-gray-50 rounded-xl p-6 text-center">
                        <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                        <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {player.bio_fr && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Biographie</h2>
                  <p className="text-gray-600 leading-relaxed">{player.bio_fr}</p>
                </div>
              )}

              {player.highlight_video && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Video Highlights</h2>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <iframe src={player.highlight_video} className="w-full h-full" allowFullScreen title="Player highlights" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
