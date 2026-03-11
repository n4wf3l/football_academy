import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTournaments } from '../api/endpoints';
import type { Tournament } from '../types';
import SectionTitle from '../components/SectionTitle';
import Reveal from '../components/Reveal';
import { useLang } from '../contexts/LanguageContext';

export default function Tournaments() {
  const { lang, t } = useLang();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  const statusLabels: Record<Tournament['status'], { label: string; color: string }> = {
    upcoming: { label: t('À venir', 'Upcoming'), color: 'bg-blue-100 text-blue-800' },
    ongoing: { label: t('En cours', 'Ongoing'), color: 'bg-green-100 text-green-800' },
    completed: { label: t('Terminé', 'Completed'), color: 'bg-gray-100 text-gray-800' },
  };

  useEffect(() => {
    fetchTournaments().then((data) => { setTournaments(data); setLoading(false); });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <>
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-20 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="animate-page-hero text-4xl md:text-5xl font-black mb-4">{t('Tournois & Événements', 'Tournaments & Events')}</h1>
          <p className="animate-page-hero-sub text-xl text-gray-300">{t('Journées de détection, tournois et matchs amicaux internationaux', 'Scouting days, tournaments and international friendly matches')}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tournaments.length > 0 ? (
            <div className="space-y-6">
              {tournaments.map((tn, i) => (
                <Reveal key={tn.id} delay={Math.min(i * 0.08, 0.5)} direction="up">
                  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0 text-center bg-primary/5 rounded-xl p-4 w-24">
                      <div className="text-2xl font-black text-primary">{new Date(tn.start_date).getDate()}</div>
                      <div className="text-sm text-gray-500">{new Date(tn.start_date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{tn.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[tn.status].color}`}>
                          {statusLabels[tn.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{tn.category} | {tn.location}</p>
                      {(lang === 'en' ? tn.description_en : tn.description_fr) && <p className="text-gray-600 text-sm">{lang === 'en' ? tn.description_en : tn.description_fr}</p>}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(tn.start_date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR')} - {new Date(tn.end_date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR')}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t('Aucun événement programmé pour le moment.', 'No events scheduled at the moment.')}</p>
              <p className="text-gray-400 text-sm mt-2">{t('Les prochains tournois et journées de détection seront annoncés ici.', 'Upcoming tournaments and scouting days will be announced here.')}</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle title={t('Pour les Scouts & Clubs', 'For Scouts & Clubs')} subtitle={t('Nous invitons les recruteurs à nos événements', 'We invite recruiters to our events')} />
          </Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 mb-6">
              {t('Si vous êtes un scout ou un directeur de recrutement et souhaitez assister à nos tournois ou organiser une journée de détection, contactez-nous.', 'If you are a scout or recruitment director and wish to attend our tournaments or organize a scouting day, contact us.')}
            </p>
            <Link to="/contact" className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              {t('Nous contacter', 'Contact Us')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
