import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHome } from '../api/endpoints';
import type { HomeData } from '../types';
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
      <section className="relative bg-dark text-white overflow-hidden flex items-center" style={{ minHeight: '100vh' }}>
        {/* Soft accent glows */}
        <div className="absolute -top-48 -right-48 w-[640px] h-[640px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-56 -left-40 w-[520px] h-[520px] rounded-full bg-primary-light/[0.06] blur-3xl pointer-events-none" />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Bottom fade into next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-dark pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
          {/* Top metadata strip */}
          <div className="animate-hero-badge flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/45 mb-10 font-medium">
            <span className="flex items-center gap-2">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-primary-light animate-ping opacity-60" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-primary-light" />
              </span>
              {settings.hero_badge}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>U13 — U19</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{t('Saison', 'Season')} {new Date().getFullYear()}/{(new Date().getFullYear() + 1).toString().slice(-2)}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: title and CTAs */}
            <div className="lg:col-span-7">
              <h1 className="animate-hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-7">
                {settings.hero_title}
              </h1>
              <p className="animate-hero-subtitle text-base md:text-lg text-white/65 mb-10 leading-relaxed max-w-xl">
                {settings.hero_subtitle}
              </p>
              <div className="animate-hero-buttons flex flex-wrap items-center gap-2 mb-10">
                <Link
                  to="/players"
                  className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-full font-medium text-[14px] transition-all"
                >
                  {t('Découvrir nos talents', 'Discover our talents')}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-white/75 hover:text-white px-5 py-3 rounded-full font-medium text-[14px] transition-colors"
                >
                  {t('En savoir plus', 'Learn more')}
                </Link>
              </div>

              {/* Stats inline (compact) */}
              <div className="animate-hero-buttons grid grid-cols-3 gap-4 max-w-md pt-6 border-t border-white/10">
                {[
                  { number: '50+', label: t('Joueurs', 'Players') },
                  { number: '7', label: t('Catégories', 'Categories') },
                  { number: '10+', label: t('Clubs', 'Clubs') },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white tracking-tight">{stat.number}</div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-white/45 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: player image with overlaid event card */}
            <div className="lg:col-span-5 animate-hero-buttons">
              <div className="relative">
                {/* Soft glow behind player */}
                <div className="absolute inset-0 bg-primary/25 blur-3xl scale-90 -z-0 pointer-events-none" />

                {/* Geometric backdrop */}
                <div className="absolute inset-x-6 top-12 bottom-4 border border-white/10 rounded-[2.5rem] -z-0 pointer-events-none" />

                {/* Player image */}
                <img
                  src="/playerHome.png"
                  alt={t("Joueur de l'académie", 'Academy player')}
                  className="relative w-full max-w-sm mx-auto block drop-shadow-2xl"
                />

                {/* Floating jersey/category badge */}
                <div className="absolute top-4 right-0 sm:right-4 bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary-light font-black text-sm">19</span>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/50 leading-none">{t('Catégorie', 'Category')}</div>
                    <div className="text-sm font-bold text-white leading-tight mt-0.5">U17</div>
                  </div>
                </div>

                {/* Floating next event card overlaid bottom */}
                {data.upcoming_tournaments.length > 0 && (
                  <Link
                    to="/tournaments"
                    className="absolute -bottom-2 left-0 right-0 group rounded-2xl border border-white/[0.1] bg-dark/80 backdrop-blur-md hover:bg-dark/90 hover:border-white/[0.2] p-4 transition-all"
                  >
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {t('Prochain événement', 'Upcoming event')}
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-primary-light text-[11px] font-semibold mb-0.5 uppercase tracking-wider">{data.upcoming_tournaments[0].category}</div>
                        <h3 className="text-sm font-semibold text-white mb-0.5 truncate">{data.upcoming_tournaments[0].name}</h3>
                        <p className="text-[11px] text-white/50">
                          {new Date(data.upcoming_tournaments[0].start_date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}
                          {data.upcoming_tournaments[0].location}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-hero-scroll">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">{t('Défiler', 'Scroll')}</span>
            <svg className="w-3.5 h-3.5 text-white/30 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Notre Vision — Editorial split with photo collage */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #1B5E20 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: editorial text */}
            <Reveal direction="left" className="lg:col-span-5">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                  <span className="w-8 h-px bg-primary" />
                  {t('Notre vision', 'Our vision')}
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 tracking-tight leading-[1.05] mb-6">
                  {t('Détecter, former,', 'Detect, develop,')}<br />
                  <span className="text-primary">{t('accompagner.', 'support.')}</span>
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    {t(
                      'Notre centre a pour vocation de détecter, former et accompagner les jeunes talents vers le football professionnel européen.',
                      'Our center is dedicated to detecting, developing and supporting young talents towards European professional football.'
                    )}
                  </p>
                  <p>
                    {t(
                      'Encadrement technique et tactique de haut niveau, préparation physique adaptée, suivi scolaire et éducation aux valeurs du sport.',
                      'High-level technical and tactical training, tailored physical preparation, academic monitoring and sports values education.'
                    )}
                  </p>
                </div>

                {/* Infrastructures chips */}
                <div className="flex flex-wrap gap-2 mt-7">
                  {[
                    t("Terrain", 'Field'),
                    t('Internat', 'Boarding'),
                    t('Salle de musculation', 'Gym'),
                    t("Salle d'étude", 'Study room'),
                  ].map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:border-primary/40 hover:bg-primary/5 transition-colors">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {item}
                    </span>
                  ))}
                </div>

                <Link to="/about" className="group inline-flex items-center gap-2 mt-8 text-primary font-semibold text-sm">
                  {t('Découvrir le centre', 'Discover the center')}
                  <span className="w-7 h-7 rounded-full border border-primary/30 group-hover:bg-primary group-hover:border-primary flex items-center justify-center transition-all">
                    <svg className="w-3 h-3 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </Reveal>

            {/* Right: photo collage */}
            <Reveal direction="right" delay={0.2} className="lg:col-span-7">
              <div className="relative">
                <div className="grid grid-cols-3 gap-3 h-[26rem] lg:h-[32rem]">
                  {/* Main atmospheric photo */}
                  <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group">
                    <img
                      src="/entry-players.jpg"
                      alt={t('Joueurs entrant sur le terrain', 'Players entering the field')}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-white/75 mb-1.5 font-medium">{t('Sur le terrain', 'On the field')}</div>
                      <div className="text-white text-lg font-semibold">{t('Esprit de groupe', 'Team spirit')}</div>
                    </div>
                  </div>

                  {/* Top right */}
                  <div className="relative rounded-2xl overflow-hidden group">
                    <img
                      src="/group-players.jpg"
                      alt={t("L'équipe", 'The team')}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-[9px] uppercase tracking-[0.2em] text-white/80 leading-tight font-medium">{t("L'équipe", 'The team')}</div>
                    </div>
                  </div>

                  {/* Bottom right */}
                  <div className="relative rounded-2xl overflow-hidden group">
                    <img
                      src="/moigny.jpg"
                      alt={t('Direction', 'Direction')}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-[9px] uppercase tracking-[0.2em] text-white/80 leading-tight font-medium">{t('Direction', 'Direction')}</div>
                    </div>
                  </div>
                </div>

                {/* Floating credibility badge */}
                <div className="absolute -bottom-5 right-4 sm:right-8 bg-white shadow-2xl rounded-2xl px-4 py-2.5 border border-gray-100 flex items-center gap-2.5 animate-float-soft">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50" />
                    <span className="relative w-2 h-2 rounded-full bg-primary" />
                  </span>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 leading-none">{t('Centre actif', 'Active center')}</div>
                    <div className="text-sm font-semibold text-gray-900 leading-tight mt-0.5">5 {t('entraînements / sem.', 'trainings / week')}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Video Presentation */}
      {settings.hero_video_url && (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Reveal>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                  <span className="w-6 h-px bg-primary" />
                  {t('Vidéo', 'Video')}
                  <span className="w-6 h-px bg-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                  {t('Le centre,', 'The center,')} <span className="text-primary">{t('en images.', 'in images.')}</span>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative group">
                {/* Decorative offset frame */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 bg-primary/15 rounded-3xl -z-10" />
                <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-black">
                  <iframe
                    src={settings.hero_video_url}
                    className="w-full h-full"
                    allowFullScreen
                    title={t('Vidéo de présentation', 'Presentation video')}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Featured Players — Trading-card style */}
      {data.featured_players.length > 0 && (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Header — split layout */}
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                    <span className="w-8 h-px bg-primary" />
                    {t('Talents', 'Talents')}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.05]">
                    {t('Nos meilleurs', 'Our best')}<br />
                    <span className="text-primary">{t('joueurs.', 'players.')}</span>
                  </h2>
                </div>
                <Link to="/players" className="hidden md:inline-flex items-center gap-2 group text-sm font-semibold text-gray-900 hover:text-primary transition-colors">
                  {t('Voir tous les joueurs', 'See all players')}
                  <span className="w-9 h-9 rounded-full border border-gray-300 group-hover:bg-primary group-hover:border-primary flex items-center justify-center transition-all">
                    <svg className="w-3.5 h-3.5 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </Reveal>

            {/* Modern player grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {data.featured_players.map((player, i) => {
                const age = new Date().getFullYear() - new Date(player.date_of_birth).getFullYear();
                return (
                  <Reveal key={player.id} delay={i * 0.06} direction="up">
                    <Link
                      to={`/players/${player.id}`}
                      className="group relative block aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-dark to-primary"
                    >
                      {/* Photo */}
                      {player.photo ? (
                        <img
                          src={player.photo}
                          alt={`${player.first_name} ${player.last_name}`}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-20 h-20 text-white/25" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      {/* Top tags */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-900 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full">
                          {player.position}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-white bg-primary/90 backdrop-blur px-2.5 py-1 rounded-full">
                          {player.category}
                        </span>
                      </div>

                      {/* Bottom — name & stats */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="text-[11px] text-white/70 uppercase tracking-wider mb-0.5">{age} {t('ans', 'years')}</div>
                        <div className="text-lg font-medium leading-tight truncate">{player.first_name}</div>
                        <div className="text-2xl font-black tracking-tight uppercase leading-tight truncate">{player.last_name}</div>

                        {/* Stats slide-up on hover */}
                        {player.matches_played > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-24 transition-all duration-500 overflow-hidden">
                            <div>
                              <div className="text-base font-bold leading-none">{player.matches_played}</div>
                              <div className="text-[9px] uppercase tracking-wider text-white/55 mt-1">{t('Matchs', 'Games')}</div>
                            </div>
                            <div>
                              <div className="text-base font-bold leading-none">{player.goals}</div>
                              <div className="text-[9px] uppercase tracking-wider text-white/55 mt-1">{t('Buts', 'Goals')}</div>
                            </div>
                            <div>
                              <div className="text-base font-bold leading-none">{player.assists}</div>
                              <div className="text-[9px] uppercase tracking-wider text-white/55 mt-1">{t('Passes', 'Assists')}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>

            {/* Mobile see-all */}
            <Reveal delay={0.3}>
              <div className="md:hidden text-center mt-10">
                <Link to="/players" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-full font-medium text-sm transition-all">
                  {t('Voir tous les joueurs', 'See all players')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Program — Numbered timeline pillars */}
      <section className="py-24 lg:py-32 bg-dark text-white relative overflow-hidden">
        {/* Atmospheric background glows */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl pointer-events-none animate-glow-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary-light/[0.04] blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="max-w-3xl mb-16">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary-light font-semibold mb-4">
                <span className="w-8 h-px bg-primary-light" />
                {t('Programme', 'Program')}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.05] mb-5">
                {t('Trois piliers pour', 'Three pillars to')}<br />
                <span className="text-primary-light">{t('forger un avenir.', 'forge a future.')}</span>
              </h2>
              <p className="text-white/55 text-lg leading-relaxed">
                {t('Un programme complet pour le développement intégral du joueur — sur le terrain, à l\'école, dans la vie.', "A comprehensive program for the player's integral development — on the field, at school, in life.")}
              </p>
            </div>
          </Reveal>

          {/* Pillars */}
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.06] rounded-3xl overflow-hidden border border-white/[0.06]">
            {[
              { title: t('Entraînement', 'Training'), desc: t('5 séances par semaine avec des entraîneurs diplômés. Travail technique, tactique et préparation physique.', '5 sessions per week with certified coaches. Technical, tactical and physical preparation.'), kicker: t('Sportif', 'Athletic') },
              { title: t('Éducation', 'Education'), desc: t('Suivi scolaire obligatoire. Nous formons des joueurs mais aussi des hommes responsables.', 'Mandatory academic monitoring. We train players but also responsible individuals.'), kicker: t('Académique', 'Academic') },
              { title: t('Compétitions', 'Competitions'), desc: t('Participation à des championnats, tournois nationaux et internationaux pour se confronter au haut niveau.', 'Participation in championships, national and international tournaments at the highest level.'), kicker: t('Performance', 'Performance') },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.12} direction="up">
                <div className="group relative bg-dark p-8 lg:p-10 h-full hover:bg-white/[0.02] transition-colors duration-300">
                  <div className="flex items-start justify-between mb-8">
                    <span className="text-5xl lg:text-6xl font-black text-white/10 group-hover:text-primary-light/40 transition-colors duration-500 tracking-tight leading-none">
                      0{i + 1}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-primary-light font-semibold mt-3">
                      {item.kicker}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-white/55 leading-relaxed text-[15px]">{item.desc}</p>

                  {/* Bottom hover indicator */}
                  <div className="mt-8 flex items-center gap-2 text-[12px] font-semibold text-primary-light translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="w-6 h-px bg-primary-light" />
                    {t('En savoir plus', 'Learn more')}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/program" className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-7 py-3.5 rounded-full font-medium text-sm transition-all">
                {t('Programme complet', 'Full program')}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link to="/about" className="text-white/60 hover:text-white text-sm font-medium px-5 py-3.5 transition-colors">
                {t('Découvrir le centre', 'Discover the center')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tournaments — Ticket strip */}
      {data.upcoming_tournaments.length > 0 && (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                    <span className="w-8 h-px bg-primary" />
                    {t('Calendrier', 'Calendar')}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.05]">
                    {t('Prochains', 'Upcoming')}<br />
                    <span className="text-primary">{t('événements.', 'events.')}</span>
                  </h2>
                </div>
                <Link to="/tournaments" className="hidden md:inline-flex items-center gap-2 group text-sm font-semibold text-gray-900 hover:text-primary transition-colors">
                  {t('Voir le calendrier', 'See calendar')}
                  <span className="w-9 h-9 rounded-full border border-gray-300 group-hover:bg-primary group-hover:border-primary flex items-center justify-center transition-all">
                    <svg className="w-3.5 h-3.5 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </Reveal>

            <div className="space-y-3">
              {data.upcoming_tournaments.map((tournament, i) => {
                const start = new Date(tournament.start_date);
                const end = new Date(tournament.end_date);
                const monthLabel = start.toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { month: 'short' }).replace('.', '').toUpperCase();
                return (
                  <Reveal key={tournament.id} delay={i * 0.08} direction="up">
                    <Link
                      to="/tournaments"
                      className="group block bg-white border border-gray-200 hover:border-primary/40 rounded-2xl p-4 sm:p-5 transition-all hover:shadow-[0_12px_40px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-4 sm:gap-6">
                        {/* Date block */}
                        <div className="shrink-0 w-16 sm:w-20 text-center py-1">
                          <div className="text-[10px] uppercase tracking-wider text-primary font-bold">{monthLabel}</div>
                          <div className="text-3xl sm:text-4xl font-black text-gray-900 leading-none mt-1 tracking-tight">{start.getDate()}</div>
                          <div className="text-[10px] text-gray-400 mt-1 font-medium">{start.getFullYear()}</div>
                        </div>

                        {/* Vertical separator */}
                        <div className="self-stretch w-px bg-gray-200 group-hover:bg-primary/30 transition-colors" />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2">
                            {tournament.category}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight truncate">{tournament.name}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1.5">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                              </svg>
                              {tournament.location}
                            </span>
                            <span className="text-gray-300">·</span>
                            <span>
                              {start.toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short' })}
                              {' — '}
                              {end.toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <svg className="hidden sm:block w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>

            {/* Mobile see-all */}
            <Reveal delay={0.3}>
              <div className="md:hidden text-center mt-8">
                <Link to="/tournaments" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {t('Voir le calendrier', 'See calendar')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* CTA — Editorial split with image */}
      <section className="relative overflow-hidden bg-dark">
        <div className="grid md:grid-cols-2 min-h-[420px]">
          {/* Image side */}
          <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
            <img
              src="/group-players.jpg"
              alt={t("L'équipe", 'The team')}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-dark via-dark/40 to-transparent md:from-transparent md:via-dark/20 md:to-dark" />

            {/* Floating "Partenariats" stat tag — bottom-left on image */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/[0.08] backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-3 animate-float-slower">
              <div className="w-10 h-10 rounded-full bg-primary-light/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none">10+</div>
                <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1">{t('Clubs partenaires', 'Partner clubs')}</div>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div className="relative flex items-center px-6 sm:px-12 lg:px-16 py-16 md:py-20">
            {/* Subtle accent */}
            <div className="absolute top-12 right-12 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <Reveal direction="right" className="relative">
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary-light font-semibold mb-4">
                  <span className="w-8 h-px bg-primary-light" />
                  {t('Partenariats', 'Partnerships')}
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white tracking-tight leading-[1.05] mb-5">
                  {t('Vous êtes un club', 'Are you a club')}<br />
                  <span className="text-primary-light">{t('ou un scout?', 'or a scout?')}</span>
                </h2>
                <p className="text-white/60 mb-8 leading-relaxed">
                  {t('Contactez-nous pour découvrir nos talents et établir un partenariat sur-mesure avec notre centre.', 'Contact us to discover our talents and establish a tailored partnership with our center.')}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link to="/contact" className="group inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-primary-light hover:text-white px-7 py-3.5 rounded-full font-medium text-sm transition-all">
                    {t('Prendre contact', 'Get in touch')}
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link to="/players" className="text-white/70 hover:text-white text-sm font-medium px-5 py-3.5 transition-colors">
                    {t('Découvrir nos talents', 'Discover our talents')}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
