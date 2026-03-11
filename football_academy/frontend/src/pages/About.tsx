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
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-20 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 animate-page-hero">{t('Académie Jean-Jacques Ndomba "Géomètre"', 'Jean-Jacques Ndomba "Geometre" Academy')}</h1>
          <p className="text-xl text-gray-300 max-w-2xl animate-page-hero-sub">
            {t("Un centre de formation Sport-Études implanté à Ngania, au Congo, pour former les champions de demain sur et en dehors du terrain.", "A Sport-Studies training center located in Ngania, Congo, to train tomorrow's champions on and off the field.")}
          </p>
          <button
            onClick={() => generateCenterPdf(settings, staff, partners, lang)}
            className="mt-6 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('Télécharger le dossier PDF', 'Download PDF Presentation')}
          </button>
        </div>
      </section>

      {/* Fondateur & Origine */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle
              title={t('Le Fondateur', 'The Founder')}
              subtitle={t("Général Paul Victor Moigny", 'General Paul Victor Moigny')}
            />
          </Reveal>
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <Reveal direction="left" className="md:col-span-3">
              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>
                  {t(
                    "Le Général Paul Victor Moigny, ancien footballeur professionnel, ancien vice-président de la FECOFOOT et ancien président du FCF La Source (une équipe féminine), est le Président de l'Association pour l'Amour de la Jeunesse et du Foot, porteuse du projet Académie Foot et Étude. Un centre qui formera des jeunes talents congolais au métier du football.",
                    'General Paul Victor Moigny, former professional footballer, former vice-president of FECOFOOT and former president of FCF La Source (a women\'s team), is the President of the Association for the Love of Youth and Football, which carries the Foot & Study Academy project. A center that will train young Congolese talent in the profession of football.'
                  )}
                </p>
                <blockquote className="border-l-4 border-primary pl-5 py-3 italic text-gray-700 bg-primary/5 rounded-r-lg">
                  {t(
                    '"Relever le niveau du football congolais, c\'est miser sur la jeunesse et la formation de jeunes joueurs pour assurer un meilleur futur, avec pour but de figurer parmi les meilleures académies internationales."',
                    '"Raising the level of Congolese football means investing in youth and training young players to ensure a better future, with the goal of being among the best international academies."'
                  )}
                </blockquote>
                <p>
                  {t(
                    "Pour le passionné du football qu'il est, la création de centres de formation à travers le pays contribuera à relever le niveau de ce football. Certains pays, affirme-t-il, ont réalisé des progrès et sont devenus de grandes nations parce qu'ils s'appuient sur les académies. L'ambition est de former des footballeurs professionnels capables de renforcer les clubs et les sélections nationales.",
                    'As the football enthusiast he is, the creation of training centers across the country will help raise the level of football. Some countries, he says, have made progress and become great nations because they rely on academies. The ambition is to train professional footballers capable of strengthening clubs and national teams.'
                  )}
                </p>
              </div>
            </Reveal>
            <Reveal direction="right" className="md:col-span-2">
              <div className="space-y-6">
              {/* Portrait */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img src="/moigny.jpg" alt="Général Paul Victor Moigny" className="w-full h-64 object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-lg">{t('Gal Paul Victor Moigny', 'Gen. Paul Victor Moigny')}</p>
                  <p className="text-white/70 text-sm">{t('Fondateur & Président', 'Founder & President')}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">{t('En bref', 'At a Glance')}</h3>
                <div className="space-y-3">
                  {[
                    { label: t('Fondateur', 'Founder'), value: 'Gal Paul Victor Moigny' },
                    { label: t('Statut', 'Status'), value: t('Ancien footballeur professionnel', 'Former professional footballer') },
                    { label: t('Association', 'Association'), value: t("Assoc. pour l'Amour de la Jeunesse et du Foot", 'Assoc. for the Love of Youth and Football') },
                    { label: t('Nom', 'Named After'), value: 'Jean-Jacques Ndomba "Géomètre"' },
                    { label: t('Localisation', 'Location'), value: t('Ngania, Dept. des Plateaux, Congo', 'Ngania, Plateaux Dept., Congo') },
                    { label: t('Superficie', 'Area'), value: '15 hectares' },
                    { label: t('Terrains', 'Fields'), value: t('4 terrains de football', '4 football fields') },
                    { label: t('Tranche d\'âge', 'Age Range'), value: t('10 à 19 ans', '10 to 19 years old') },
                    { label: t('Pensionnaires', 'Students'), value: t('~100 apprentis footballeurs', '~100 apprentice footballers') },
                    { label: t('Scolarité', 'Schooling'), value: t('Collège et Lycée', 'Middle & High School') },
                    { label: t('Débouchés', 'Opportunities'), value: t('Clubs pro D1 & D2 congolais', 'Congolese D1 & D2 pro clubs') },
                    { label: t('Ambition', 'Ambition'), value: t('Figurer parmi les meilleures académies internationales', 'Be among the best international academies') },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-start gap-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[90px]">{item.label}</span>
                      <span className="text-sm text-gray-700 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Sport-Études */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <Reveal direction="left">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('Notre Mission', 'Our Mission')}</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>{t(
                    '"C\'est ma contribution et j\'essayerai de faire qu\'elle soit pérenne dans le temps, qu\'elle forme au maximum les joueurs qui renforceront, demain, nos clubs et nos sélections nationales. Bref, c\'est la touche que j\'apporte à la résolution d\'une problématique qui se pose au niveau national."',
                    '"This is my contribution and I will try to make it sustainable over time, to train as many players as possible who will strengthen our clubs and national teams tomorrow. In short, it is my touch to solving a problem that exists at the national level."'
                  )}</p>
                  <p>{t(
                    "L'Académie est implantée sur un terrain de 15 hectares où ont été construits quatre terrains de football et un bâtiment comprenant des salles de classe qui a été remis à l'État dans le cadre d'une convention signée avec le Gouvernement. Le choix du village de Ngania n'est pas un hasard : selon Victor Moigny, les conditions de formation sont mieux réunies en campagne qu'en ville, loin des distractions urbaines, offrant un cadre idéal pour le développement des jeunes talents. Des opérations de détection ont eu lieu dans tous les départements. La sélection a comporté plusieurs étapes et seuls les meilleurs ont été retenus.",
                    'The Academy is located on a 15-hectare site where four football fields and a building with classrooms have been built, handed over to the State under an agreement signed with the Government. The choice of the village of Ngania is no coincidence: according to Victor Moigny, training conditions are better met in rural areas than in cities, away from urban distractions, providing an ideal environment for developing young talent. Scouting operations took place in all departments. The selection involved several stages and only the best were retained.'
                  )}</p>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('Sport-Études', 'Sport & Studies')}</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>{t(
                    "C'est une académie Sport-Études accueillant des jeunes de 10 à 19 ans. Elle a pour vocation de former des footballeurs, mais aidera également les enfants à briller dans les études afin qu'ils deviennent des hommes aguerris. Les enfants suivent une scolarité normale au collège et au lycée, puis tous se retrouvent sur le terrain pour être préparés au métier de footballeur.",
                    'It is a Sport-Studies academy welcoming youth aged 10 to 19. Its vocation is to train footballers, but it also helps children excel in their studies so they become well-rounded individuals. Students follow a normal curriculum in middle and high school, then all meet on the field to be prepared for the profession of footballer.'
                  )}</p>
                  <p>{t(
                    "Les enfants sont logés, nourris, soignés, formés et bénéficient d'une police d'assurance. Les joueurs formés seront par la suite envoyés dans des clubs professionnels congolais de D1 et D2 pour potentiellement participer au championnat national. Notre projet n'a rien à voir avec l'argent, ce n'est pas du business.",
                    'Children are housed, fed, cared for, trained and benefit from an insurance policy. Trained players will subsequently be sent to Congolese professional D1 and D2 clubs to potentially participate in the national championship. Our project has nothing to do with money, it is not a business.'
                  )}</p>
                </div>
                <ul className="mt-6 space-y-3">
                  {(lang === 'en' ? [
                    'Train technically and tactically competent players',
                    'Ensure quality academic and educational support',
                    'Develop physical and mental qualities',
                    'Place players in Congolese D1 & D2 professional clubs',
                    'Develop responsible and disciplined individuals',
                  ] : [
                    'Former des joueurs techniquement et tactiquement compétents',
                    'Assurer un suivi scolaire et éducatif de qualité',
                    'Développer les qualités physiques et mentales',
                    'Placer les joueurs dans des clubs professionnels congolais de D1 et D2',
                    'Former des hommes responsables et disciplinés',
                  ]).map((obj) => (
                    <li key={obj} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Visual banner */}
      <Reveal>
        <section className="relative h-72 md:h-96 overflow-hidden">
          <img src="/entry-players.jpg" alt={t('Joueurs de l\'académie', 'Academy players')} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/70 to-dark/50 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <p className="text-white text-3xl md:text-4xl font-bold max-w-xl leading-tight">
                {t('Détecter, former et accompagner les talents de demain', 'Detect, train and support tomorrow\'s talents')}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Processus de Détection */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle
              title={t('Processus de Détection', 'Scouting Process')}
              subtitle={t("L'académie regroupe les meilleurs jeunes footballeurs de tous les départements du pays", 'The academy brings together the best young footballers from all departments across the country')}
            />
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: t('Pré-sélection départementale', 'Departmental Pre-selection'),
                desc: t(
                  'Dans chaque capitale de département en République du Congo, une pré-sélection de joueurs est organisée pour identifier les meilleurs talents locaux.',
                  'In each department capital of the Republic of Congo, a pre-selection of players is organized to identify the best local talents.'
                ),
              },
              {
                step: '02',
                title: t('Sélection nationale', 'National Selection'),
                desc: t(
                  'Les meilleurs joueurs de chaque département sont réunis pour une phase de sélection nationale. La sélection comporte plusieurs étapes rigoureuses.',
                  'The best players from each department are brought together for a national selection phase. The selection involves several rigorous stages.'
                ),
              },
              {
                step: '03',
                title: t("Intégration à l'Académie", 'Academy Integration'),
                desc: t(
                  "Seuls les meilleurs sont retenus et intègrent l'Académie où ils bénéficient d'une formation complète : football, scolarité, hébergement, soins médicaux et assurance.",
                  'Only the best are selected and join the Academy where they receive comprehensive training: football, education, accommodation, medical care and insurance.'
                ),
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.15} direction="up">
                <div className="relative border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <span className="absolute -top-4 left-6 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">{item.step}</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 mt-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionTitle title={t("Méthodologie d'Entraînement", 'Training Methodology')} subtitle={t('Une approche structurée et moderne de la formation', 'A structured and modern approach to training')} />
          </Reveal>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: t('Technique', 'Technical'), desc: t('Maîtrise du ballon, dribble, passes, frappes', 'Ball mastery, dribbling, passing, shooting'), color: 'from-green-500 to-green-700' },
              { title: t('Tactique', 'Tactical'), desc: t('Compréhension du jeu, placement, transitions', 'Game understanding, positioning, transitions'), color: 'from-blue-500 to-blue-700' },
              { title: t('Physique', 'Physical'), desc: t('Endurance, vitesse, force, coordination', 'Endurance, speed, strength, coordination'), color: 'from-orange-500 to-orange-700' },
              { title: t('Mental', 'Mental'), desc: t("Concentration, confiance, esprit d'équipe", 'Focus, confidence, teamwork'), color: 'from-purple-500 to-purple-700' },
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
            <SectionTitle title={t('Nos Infrastructures', 'Our Facilities')} subtitle={t('15 hectares dédiés à la formation sportive et scolaire', '15 hectares dedicated to sports and academic training')} />
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('4 Terrains de football', '4 Football Fields'), desc: t('Quatre terrains de football construits sur le site de 15 hectares pour les séances quotidiennes et les matchs.', 'Four football fields built on the 15-hectare site for daily training sessions and matches.') },
              { title: t('Internat', 'Boarding House'), desc: t("Hébergement complet : les enfants sont logés, nourris, soignés et bénéficient d'une police d'assurance.", 'Full boarding: children are housed, fed, cared for and benefit from an insurance policy.') },
              { title: t('Salles de classe', 'Classrooms'), desc: t("Bâtiment scolaire remis à l'État dans le cadre d'une convention avec le Gouvernement. Scolarité de la 6e à la Terminale.", 'School building handed over to the State under a government agreement. Schooling from 6th grade to senior year.') },
              { title: t('Salle de musculation', 'Gym'), desc: t('Équipement pour la préparation physique et la rééducation des joueurs.', 'Equipment for physical training and player rehabilitation.') },
              { title: t('Vestiaires', 'Changing Rooms'), desc: t('Vestiaires équipés avec douches pour le confort des pensionnaires.', 'Equipped changing rooms with showers for boarder comfort.') },
              { title: t('Bureau médical', 'Medical Office'), desc: t('Suivi médical régulier et prise en charge des blessures sur place.', 'Regular medical monitoring and on-site injury management.') },
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
            <SectionTitle title={t('Notre Encadrement', 'Our Coaching Staff')} subtitle={t('Une équipe qualifiée et passionnée', 'A qualified and passionate team')} />
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
            <p className="text-center text-gray-500">{t('Encadrement à venir...', 'Coaching staff coming soon...')}</p>
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
            <p className="text-center text-gray-500">{t('Partenaires à venir...', 'Partners coming soon...')}</p>
          )}
        </div>
      </section>
    </>
  );
}
