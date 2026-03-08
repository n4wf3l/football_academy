import { useEffect, useState } from 'react';
import { fetchStaff, fetchPartners } from '../api/endpoints';
import type { Staff, Partner } from '../types';
import SectionTitle from '../components/SectionTitle';
import Reveal from '../components/Reveal';
import { useLang } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { generateCenterPdf } from '../utils/generateCenterPdf';

export default function About() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const { lang, t } = useLang();
  const { settings } = useSettings();

  useEffect(() => {
    fetchStaff().then(setStaff);
    fetchPartners().then(setPartners);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 animate-page-hero">{t('Notre Centre de Formation', 'Our Training Center')}</h1>
          <p className="text-xl text-gray-300 max-w-2xl animate-page-hero-sub">
            {t('Un projet sportif ambitieux au service du developpement des jeunes talents africains.', 'An ambitious sports project dedicated to developing young African talent.')}
          </p>
          <button
            onClick={() => generateCenterPdf(settings, staff, partners, lang)}
            className="mt-6 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('Telecharger le dossier PDF', 'Download PDF Presentation')}
          </button>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <Reveal direction="left">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('Notre Vision', 'Our Vision')}</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>{t(
                    "Devenir un centre de reference en Afrique pour la formation de jeunes footballeurs capables d'integrer les meilleurs clubs europeens et africains.",
                    'To become a reference center in Africa for training young footballers capable of joining the best European and African clubs.'
                  )}</p>
                  <p>{t(
                    'Nous croyons que chaque jeune talent merite une chance de realiser son reve, avec un accompagnement professionnel complet.',
                    'We believe every young talent deserves a chance to achieve their dream, with comprehensive professional support.'
                  )}</p>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('Nos Objectifs', 'Our Goals')}</h2>
                <ul className="space-y-4">
                  {(lang === 'en' ? [
                    'Train technically and tactically competent players',
                    'Ensure quality academic and educational support',
                    'Develop physical and mental qualities',
                    'Place players in professional clubs',
                    'Develop responsible and disciplined individuals',
                  ] : [
                    'Former des joueurs techniquement et tactiquement competents',
                    'Assurer un suivi scolaire et educatif de qualite',
                    'Developper les qualites physiques et mentales',
                    'Placer les joueurs dans des clubs professionnels',
                    'Former des hommes responsables et disciplines',
                  ]).map((obj) => (
                    <li key={obj} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle title={t("Methodologie d'Entrainement", 'Training Methodology')} subtitle={t('Une approche structuree et moderne de la formation', 'A structured and modern approach to training')} />
          </Reveal>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: t('Technique', 'Technical'), desc: t('Maitrise du ballon, dribble, passes, frappes', 'Ball mastery, dribbling, passing, shooting'), color: 'from-green-500 to-green-700' },
              { title: t('Tactique', 'Tactical'), desc: t('Comprehension du jeu, placement, transitions', 'Game understanding, positioning, transitions'), color: 'from-blue-500 to-blue-700' },
              { title: t('Physique', 'Physical'), desc: t('Endurance, vitesse, force, coordination', 'Endurance, speed, strength, coordination'), color: 'from-orange-500 to-orange-700' },
              { title: t('Mental', 'Mental'), desc: t("Concentration, confiance, esprit d'equipe", 'Focus, confidence, teamwork'), color: 'from-purple-500 to-purple-700' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1} direction="up">
                <div className={`bg-gradient-to-br ${item.color} rounded-xl p-6 text-white hover:-translate-y-1 transition-all duration-300`}>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle title={t('Nos Infrastructures', 'Our Facilities')} subtitle={t('Des installations de qualite pour un entrainement optimal', 'Quality facilities for optimal training')} />
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t("Terrains d'entrainement", 'Training Fields'), desc: t('Terrains en gazon naturel et synthetique pour les seances quotidiennes.', 'Natural and synthetic grass fields for daily training sessions.') },
              { title: t('Internat', 'Boarding House'), desc: t("Chambres, refectoire et salle d'etude pour l'hebergement des joueurs.", 'Rooms, dining hall and study room for player accommodation.') },
              { title: t('Salle de musculation', 'Gym'), desc: t('Equipement moderne pour la preparation physique et la reeducation.', 'Modern equipment for physical training and rehabilitation.') },
              { title: t("Salle d'etude", 'Study Room'), desc: t("Espace dedie au suivi scolaire et a l'education des joueurs.", 'Dedicated space for academic support and player education.') },
              { title: t('Vestiaires', 'Changing Rooms'), desc: t('Vestiaires equipes avec douches pour le confort des joueurs.', 'Equipped changing rooms with showers for player comfort.') },
              { title: t('Bureau medical', 'Medical Office'), desc: t('Suivi medical regulier et prise en charge des blessures.', 'Regular medical monitoring and injury management.') },
            ].map((infra, i) => (
              <Reveal key={infra.title} delay={i * 0.1} direction="up">
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{infra.title}</h3>
                  <p className="text-gray-500 text-sm">{infra.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Staff */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle title={t('Notre Encadrement', 'Our Coaching Staff')} subtitle={t('Une equipe qualifiee et passionnee', 'A qualified and passionate team')} />
          </Reveal>
          {staff.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {staff.map((member, i) => (
                <Reveal key={member.id} delay={i * 0.1} direction="up">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden text-center hover:-translate-y-1 transition-all duration-300">
                    <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900">{member.name}</h3>
                      <p className="text-primary text-sm font-medium">{member.role}</p>
                      {member.qualification && <p className="text-gray-400 text-xs mt-1">{member.qualification}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">{t('Encadrement a venir...', 'Coaching staff coming soon...')}</p>
          )}
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle title={t('Nos Partenaires', 'Our Partners')} subtitle={t('Ils nous font confiance', 'They trust us')} />
          </Reveal>
          {partners.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {partners.map((partner, i) => (
                <Reveal key={partner.id} delay={i * 0.1} direction="up">
                  <div className="flex items-center justify-center p-6 border border-gray-200 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.name} className="max-h-16" />
                    ) : (
                      <span className="text-gray-600 font-semibold">{partner.name}</span>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">{t('Partenaires a venir...', 'Partners coming soon...')}</p>
          )}
        </div>
      </section>
    </>
  );
}
