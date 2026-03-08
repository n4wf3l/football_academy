import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHome } from '../api/endpoints';
import type { HomeData } from '../types';
import SectionTitle from '../components/SectionTitle';
import PlayerCard from '../components/PlayerCard';

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    fetchHome().then(setData);
  }, []);

  if (!data) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-dark via-primary-dark to-dark text-white min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-block bg-accent text-black px-4 py-1 rounded-full text-sm font-bold mb-6">
              Centre de Formation d'Excellence
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Former les <span className="text-primary-light">champions</span> de demain
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Notre centre de formation combine excellence sportive, education et developpement
              personnel pour preparer les jeunes talents au plus haut niveau du football professionnel.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/players" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Decouvrir nos talents
              </Link>
              <Link to="/about" className="border-2 border-white/30 hover:border-white text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 -mt-12 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50+', label: 'Joueurs formes' },
              { number: '5', label: "Entrainements / semaine" },
              { number: 'U13-U19', label: 'Categories' },
              { number: '10+', label: 'Partenariats clubs' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-primary">{stat.number}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle title="Notre Vision" subtitle="Un centre de formation d'excellence pour le football africain" />
              <div className="space-y-4 text-gray-600">
                <p>
                  Notre centre de formation a pour vocation de detecter, former et accompagner les jeunes
                  talents vers le football professionnel europeen.
                </p>
                <p>
                  Nous offrons un encadrement complet : entrainement technique et tactique de haut niveau,
                  preparation physique adaptee, suivi scolaire et education aux valeurs du sport.
                </p>
              </div>
              <Link to="/about" className="inline-block mt-6 text-primary font-semibold hover:underline">
                Decouvrir le centre &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["Terrain d'entrainement", 'Internat', 'Salle de musculation', "Salle d'etude"].map((item) => (
                <div key={item} className="aspect-square bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center p-4 text-white text-center text-sm font-medium">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Players */}
      {data.featured_players.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Nos Meilleurs Talents" subtitle="Les joueurs qui font la fierte de notre centre" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.featured_players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/players" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Voir tous les joueurs
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Program Preview */}
      <section className="py-20 bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Programme Sportif" subtitle="Un programme complet pour le developpement integral du joueur" light />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Entrainement', desc: '5 seances par semaine avec des entraineurs diplomes. Travail technique, tactique et preparation physique.' },
              { title: 'Education', desc: 'Suivi scolaire obligatoire. Nous formons des joueurs mais aussi des hommes responsables.' },
              { title: 'Competitions', desc: 'Participation a des championnats, tournois nationaux et internationaux pour se confronter au haut niveau.' },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10 hover:border-primary transition-colors">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/program" className="border-2 border-primary text-primary-light hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Programme complet
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      {data.upcoming_tournaments.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Prochains Evenements" subtitle="Tournois et journees de detection a venir" />
            <div className="grid md:grid-cols-3 gap-6">
              {data.upcoming_tournaments.map((t) => (
                <div key={t.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="text-sm text-primary font-semibold mb-2">{t.category}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{t.location}</p>
                  <div className="text-sm text-gray-400">
                    {new Date(t.start_date).toLocaleDateString('fr-FR')} - {new Date(t.end_date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Vous etes un club ou un scout ?</h2>
          <p className="text-xl text-green-100 mb-8">
            Contactez-nous pour decouvrir nos talents et etablir un partenariat.
          </p>
          <Link to="/contact" className="bg-white text-primary-dark hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-lg transition-colors">
            Nous contacter
          </Link>
        </div>
      </section>
    </>
  );
}
