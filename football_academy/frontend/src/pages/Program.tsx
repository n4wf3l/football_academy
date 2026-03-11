import { useEffect, useState } from 'react';
import { fetchTrainingSessions } from '../api/endpoints';
import { useLang } from '../contexts/LanguageContext';
import type { TrainingSession } from '../types';
import SectionTitle from '../components/SectionTitle';
import Reveal from '../components/Reveal';

const colorMap: Record<string, string> = {
  green: 'bg-green-50 border-green-200 text-green-800',
  blue: 'bg-blue-50 border-blue-200 text-blue-800',
  orange: 'bg-orange-50 border-orange-200 text-orange-800',
  purple: 'bg-purple-50 border-purple-200 text-purple-800',
  red: 'bg-red-50 border-red-200 text-red-800',
  gray: 'bg-gray-50 border-gray-200 text-gray-600',
};

export default function Program() {
  const { lang, t } = useLang();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);

  useEffect(() => {
    fetchTrainingSessions().then(setSessions);
  }, []);

  const DAYS = lang === 'en'
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    : ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const sessionsForDay = (day: number) =>
    sessions.filter((s) => s.day_of_week === day).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <section className="relative text-white py-20 pt-36 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/entry-players.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/85 to-primary-dark/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="animate-page-hero text-4xl md:text-5xl font-black mb-4">{t('Programme Sportif Annuel', 'Annual Sports Program')}</h1>
          <p className="animate-page-hero-sub text-xl text-gray-300">{t("Former le joueur et l'homme", 'Developing the player and the person')}</p>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle title={t('Planning Hebdomadaire', 'Weekly Schedule')} subtitle={t('5 entraînements par semaine + match le week-end', '5 training sessions per week + weekend match')} />
          </Reveal>
          <div className="grid md:grid-cols-7 gap-3">
            {DAYS.map((day, idx) => (
              <Reveal key={day} delay={Math.min(idx * 0.08, 0.5)} direction="up">
                <div
                  className={`rounded-xl p-4 hover:-translate-y-1 transition-all duration-300 ${
                    idx === 6 ? 'bg-gray-100 border border-gray-200' : 'bg-primary/5 border border-primary/20'
                  }`}
                >
                  <h3 className="font-bold text-gray-900 text-sm mb-3">{day}</h3>
                  <ul className="space-y-2">
                    {sessionsForDay(idx).map((session) => (
                      <li key={session.id} className={`text-xs rounded-lg p-2.5 border ${colorMap[session.color] || colorMap.green}`}>
                        <div className="font-semibold">{session.title}</div>
                        <div className="opacity-70 mt-0.5">{session.start_time} - {session.end_time}</div>
                        {session.category && session.category !== 'Tous' && (
                          <div className="opacity-60 mt-0.5">{session.category}</div>
                        )}
                      </li>
                    ))}
                    {sessionsForDay(idx).length === 0 && (
                      <li className="text-xs text-gray-400 italic">{t('Aucune séance', 'No session')}</li>
                    )}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Training Axes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle title={t('Axes de Développement', 'Development Areas')} subtitle={t('Un programme complet pour le développement intégral', 'A comprehensive program for integral development')} />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: t('Développement Technique', 'Technical Development'), items: lang === 'en' ? ['Ball control and oriented control', 'Short and long passing technique', 'Dribbling and feints', 'Shooting and finishing', 'Heading'] : ['Maîtrise du ballon et contrôle orienté', 'Technique de passe courte et longue', 'Dribble et feintes', 'Frappe de balle et finition', 'Jeu de tête'] },
              { title: t('Développement Tactique', 'Tactical Development'), items: lang === 'en' ? ['Understanding game systems', 'Offensive and defensive transitions', 'Pressing and counter-pressing', 'Positional play', 'Match video analysis'] : ['Compréhension des systèmes de jeu', 'Transitions offensives et défensives', 'Pressing et contre-pressing', 'Jeu de position', 'Analyse vidéo des matchs'] },
              { title: t('Préparation Physique', 'Physical Conditioning'), items: lang === 'en' ? ['Aerobic and anaerobic endurance', 'Speed and acceleration', 'Strength and power', 'Coordination and agility', 'Injury prevention'] : ['Endurance aérobique et anaérobique', 'Vitesse et accélération', 'Force et puissance', 'Coordination et agilité', 'Prévention des blessures'] },
              { title: t('Suivi Scolaire & Éducation', 'Academic Support & Education'), items: lang === 'en' ? ['Mandatory morning classes', 'Homework assistance', 'Sports values education', 'Language learning (French, English)', 'Nutrition and lifestyle education'] : ['Cours du matin obligatoires', 'Aide aux devoirs', 'Formation aux valeurs du sport', 'Apprentissage des langues (français, anglais)', "Éducation à la nutrition et à l'hygiène de vie"] },
            ].map((section, i) => (
              <Reveal key={section.title} delay={Math.min(i * 0.08, 0.5)} direction="up">
                <div className="bg-white rounded-xl p-8 shadow-md hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle title={t("Catégories d'Âge", 'Age Categories')} subtitle={t("Des programmes adaptés à chaque tranche d'âge", 'Programs adapted to each age group')} />
          </Reveal>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { cat: 'U13', age: t('11-12 ans', '11-12 years'), focus: t('Plaisir, technique individuelle, jeu réduit', 'Fun, individual technique, small-sided games') },
              { cat: 'U15', age: t('13-14 ans', '13-14 years'), focus: t('Développement technique et tactique, initiation physique', 'Technical and tactical development, physical initiation') },
              { cat: 'U17', age: t('15-16 ans', '15-16 years'), focus: t('Perfectionnement tactique, préparation physique, compétition', 'Tactical refinement, physical conditioning, competition') },
              { cat: 'U19', age: t('17-18 ans', '17-18 years'), focus: t('Pré-professionnalisation, performance, placement en clubs', 'Pre-professionalization, performance, club placement') },
            ].map((item, i) => (
              <Reveal key={item.cat} delay={Math.min(i * 0.08, 0.5)} direction="up">
                <div className="border-2 border-primary/20 rounded-xl p-6 hover:border-primary hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl font-black text-primary mb-2">{item.cat}</div>
                  <div className="text-sm text-gray-500 mb-3">{item.age}</div>
                  <p className="text-gray-600 text-sm">{item.focus}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Development */}
      <section className="py-20 bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle title={t('Suivi Individuel', 'Individual Monitoring')} subtitle={t("Chaque joueur bénéficie d'un accompagnement personnalisé", 'Each player benefits from personalized support')} light />
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('Plan de progression', 'Progress Plan'), desc: t('Objectifs individuels définis en début de saison et évalués trimestriellement.', 'Individual objectives defined at the start of the season and evaluated quarterly.') },
              { title: t('Rapport mensuel', 'Monthly Report'), desc: t('Bilan technique, physique et comportemental envoyé aux parents.', 'Technical, physical and behavioral report sent to parents.') },
              { title: t('Vidéo individuelle', 'Individual Video'), desc: t("Analyse vidéo personnalisée pour identifier les axes d'amélioration.", 'Personalized video analysis to identify areas for improvement.') },
            ].map((item, i) => (
              <Reveal key={item.title} delay={Math.min(i * 0.08, 0.5)} direction="up">
                <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10 hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
