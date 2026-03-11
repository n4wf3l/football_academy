import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHome } from '../api/endpoints';
import type { HomeData } from '../types';
import SectionTitle from '../components/SectionTitle';
import PlayerCard from '../components/PlayerCard';
import Reveal from '../components/Reveal';
import { useSettings } from '../contexts/SettingsContext';
import { useLang } from '../contexts/LanguageContext';

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const { settings } = useSettings();
  const { lang, t } = useLang();

  useEffect(() => {
    fetchHome().then(setData);
  }, []);

  if (!data) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <>
      {/* Hero */}
      <section className="relative text-white flex items-center" style={{ height: '100vh' }}>
        {/* Background image */}
        <div
          className="absolute inset-0 animate-hero-bg"
          style={{
            backgroundImage: `url('${settings.hero_image_url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="max-w-4xl">
            <div className="animate-hero-badge inline-block bg-accent text-black px-5 py-1.5 rounded-full text-sm font-bold mb-8 tracking-wide uppercase">
              {settings.hero_badge}
            </div>
            <h1 className="animate-hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-8 tracking-tight">
              {settings.hero_title}
            </h1>
            <p className="animate-hero-subtitle text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl font-light">
              {settings.hero_subtitle}
            </p>
            <div className="animate-hero-buttons flex flex-wrap gap-4">
              <Link to="/players" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105">
                {t('Découvrir nos talents', 'Discover our talents')}
              </Link>
              <Link to="/about" className="border-2 border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all">
                {t('En savoir plus', 'Learn more')}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-hero-scroll animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <Reveal>
            <div className="bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '50+', label: t('Joueurs formés', 'Trained Players') },
                { number: '5', label: t('Entraînements / semaine', 'Training / week') },
                { number: 'U13-U19', label: t('Categories', 'Categories') },
                { number: '10+', label: t('Partenariats clubs', 'Club Partnerships') },
              ].map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.1} direction="up">
                  <div className="text-center">
                    <div className="text-3xl font-black text-primary">{stat.number}</div>
                    <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal direction="left">
              <div>
                <SectionTitle title={t('Notre Vision', 'Our Vision')} subtitle={t("Un centre de formation d'excellence pour le football africain", 'A center of excellence for African football')} />
                <div className="space-y-4 text-gray-600">
                  <p>
                    {t(
                      'Notre centre de formation a pour vocation de détecter, former et accompagner les jeunes talents vers le football professionnel européen.',
                      'Our training center is dedicated to detecting, developing and supporting young talents towards European professional football.'
                    )}
                  </p>
                  <p>
                    {t(
                      'Nous offrons un encadrement complet : entraînement technique et tactique de haut niveau, préparation physique adaptée, suivi scolaire et éducation aux valeurs du sport.',
                      'We offer comprehensive support: high-level technical and tactical training, tailored physical preparation, academic monitoring and education in sports values.'
                    )}
                  </p>
                </div>
                <Link to="/about" className="inline-block mt-6 text-primary font-semibold hover:underline">
                  {t('Découvrir le centre', 'Discover the center')} &rarr;
                </Link>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  t("Terrain d'entraînement", 'Training Field'),
                  t('Internat', 'Boarding House'),
                  t('Salle de musculation', 'Gym'),
                  t("Salle d'étude", 'Study Room'),
                ].map((item, i) => (
                  <div key={item} className="aspect-square bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center p-4 text-white text-center text-sm font-medium hover:scale-105 transition-transform duration-300" style={{ animationDelay: `${i * 0.1}s` }}>
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Video Presentation */}
      {settings.hero_video_url && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionTitle title={t('Présentation du Centre', 'Center Presentation')} subtitle={t('Découvrez notre centre de formation en vidéo', 'Discover our training center in video')} />
            </Reveal>
            <Reveal delay={0.2}>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src={settings.hero_video_url}
                  className="w-full h-full"
                  allowFullScreen
                  title={t('Vidéo de présentation', 'Presentation video')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Featured Players */}
      {data.featured_players.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionTitle title={t('Nos Meilleurs Talents', 'Our Best Talents')} subtitle={t('Les joueurs qui font la fierté de notre centre', 'The players who are the pride of our center')} />
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.featured_players.map((player, i) => (
                <Reveal key={player.id} delay={i * 0.1} direction="up">
                  <PlayerCard player={player} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <div className="text-center mt-10">
                <Link to="/players" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105">
                  {t('Voir tous les joueurs', 'See all players')}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Program Preview */}
      <section className="py-20 bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle title={t('Programme Sportif', 'Sports Program')} subtitle={t('Un programme complet pour le développement intégral du joueur', "A comprehensive program for the player's integral development")} light />
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('Entrainement', 'Training'), desc: t('5 séances par semaine avec des entraîneurs diplômés. Travail technique, tactique et préparation physique.', '5 sessions per week with certified coaches. Technical, tactical and physical preparation work.') },
              { title: t('Education', 'Education'), desc: t('Suivi scolaire obligatoire. Nous formons des joueurs mais aussi des hommes responsables.', 'Mandatory academic monitoring. We train players but also responsible individuals.') },
              { title: t('Compétitions', 'Competitions'), desc: t('Participation à des championnats, tournois nationaux et internationaux pour se confronter au haut niveau.', 'Participation in championships, national and international tournaments to compete at the highest level.') },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.15} direction="up">
                <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10 hover:border-primary hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div className="text-center mt-10">
              <Link to="/program" className="border-2 border-primary text-primary-light hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105">
                {t('Programme complet', 'Full Program')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      {data.upcoming_tournaments.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionTitle title={t('Prochains Événements', 'Upcoming Events')} subtitle={t('Tournois et journées de détection à venir', 'Upcoming tournaments and scouting days')} />
            </Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              {data.upcoming_tournaments.map((tournament, i) => (
                <Reveal key={tournament.id} delay={i * 0.1} direction="up">
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="text-sm text-primary font-semibold mb-2">{tournament.category}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tournament.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{tournament.location}</p>
                    <div className="text-sm text-gray-400">
                      {new Date(tournament.start_date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR')} - {new Date(tournament.end_date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR')}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <Reveal>
        <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Reveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('Vous êtes un club ou un scout ?', 'Are you a club or a scout?')}</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl text-green-100 mb-8">
                {t('Contactez-nous pour découvrir nos talents et établir un partenariat.', 'Contact us to discover our talents and establish a partnership.')}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <Link to="/contact" className="inline-block bg-white text-primary-dark hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105">
                {t('Nous contacter', 'Contact us')}
              </Link>
            </Reveal>
          </div>
        </section>
      </Reveal>
    </>
  );
}
