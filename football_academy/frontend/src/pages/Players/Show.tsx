import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPlayer } from '../../api/endpoints';
import type { Player } from '../../types';
import Reveal from '../../components/Reveal';
import { useLang } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import { generatePlayerPdf } from '../../utils/generatePlayerPdf';

export default function PlayerShow() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const { lang, t } = useLang();
  const { settings } = useSettings();

  useEffect(() => {
    if (id) fetchPlayer(Number(id)).then(setPlayer);
  }, [id]);

  if (!player) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  const age = new Date().getFullYear() - new Date(player.date_of_birth).getFullYear();

  return (
    <>
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-12 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/players" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
            &larr; {t('Retour aux joueurs', 'Back to players')}
          </Link>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Photo */}
            <Reveal direction="left">
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
            </Reveal>

            {/* Info */}
            <Reveal direction="right" delay={0.15}>
              <div className="md:col-span-2">
                <div className="inline-block bg-accent text-black px-3 py-1 rounded-full text-sm font-bold mb-4">
                  {player.position}
                </div>
                <h1 className="animate-page-hero text-4xl font-black text-gray-900 mb-2">
                  {player.first_name} {player.last_name}
                </h1>
                <p className="animate-page-hero-sub text-gray-500 text-lg mb-4">{player.category} | {player.nationality}</p>

                <button
                  onClick={() => generatePlayerPdf(player, settings, lang)}
                  className="mb-8 inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('Télécharger le profil PDF', 'Download PDF Profile')}
                </button>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: t('Age', 'Age'), value: `${age} ${t('ans', 'yrs')}` },
                    { label: t('Taille', 'Height'), value: player.height ? `${player.height} cm` : '-' },
                    { label: t('Poids', 'Weight'), value: player.weight ? `${player.weight} kg` : '-' },
                    { label: t('Pied fort', 'Strong Foot'), value: player.preferred_foot === 'right' ? t('Droit', 'Right') : t('Gauche', 'Left') },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="text-sm text-gray-500">{stat.label}</div>
                      <div className="text-xl font-bold text-gray-900 mt-1">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {player.matches_played > 0 && (
                  <Reveal delay={0.3}>
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Statistiques', 'Statistics')}</h2>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: t('Matchs joués', 'Matches Played'), value: player.matches_played, color: 'text-blue-600' },
                          { label: t('Buts', 'Goals'), value: player.goals, color: 'text-green-600' },
                          { label: t('Passes décisives', 'Assists'), value: player.assists, color: 'text-orange-600' },
                        ].map((stat) => (
                          <div key={stat.label} className="bg-gray-50 rounded-xl p-6 text-center">
                            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                )}

                {player.bio_fr && (
                  <Reveal delay={0.4}>
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Biographie', 'Biography')}</h2>
                      <p className="text-gray-600 leading-relaxed">{lang === 'en' ? player.bio_en : player.bio_fr}</p>
                    </div>
                  </Reveal>
                )}

                {player.highlight_video && (
                  <Reveal delay={0.5} direction="up">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Video Highlights</h2>
                      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                        <iframe src={player.highlight_video} className="w-full h-full" allowFullScreen title="Player highlights" />
                      </div>
                    </div>
                  </Reveal>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
