import SectionTitle from '../components/SectionTitle';

const weekSchedule = [
  { day: 'Lundi', sessions: ['Entrainement technique (16h-18h)'] },
  { day: 'Mardi', sessions: ['Preparation physique (7h-8h)', 'Entrainement tactique (16h-18h)'] },
  { day: 'Mercredi', sessions: ['Match / Jeu reduit (10h-12h)', 'Analyse video (14h-15h)'] },
  { day: 'Jeudi', sessions: ['Entrainement technique (16h-18h)'] },
  { day: 'Vendredi', sessions: ['Preparation physique (7h-8h)', 'Entrainement tactique (16h-18h)'] },
  { day: 'Samedi', sessions: ['Match officiel ou amical'] },
  { day: 'Dimanche', sessions: ['Repos / Recuperation'] },
];

export default function Program() {
  return (
    <>
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Programme Sportif Annuel</h1>
          <p className="text-xl text-gray-300">Former le joueur et l'homme</p>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Planning Hebdomadaire" subtitle="5 entrainements par semaine + match le week-end" />
          <div className="grid md:grid-cols-7 gap-3">
            {weekSchedule.map((day) => (
              <div
                key={day.day}
                className={`rounded-xl p-4 ${
                  day.day === 'Dimanche' ? 'bg-gray-100 border border-gray-200' : 'bg-primary/5 border border-primary/20'
                }`}
              >
                <h3 className="font-bold text-gray-900 text-sm mb-3">{day.day}</h3>
                <ul className="space-y-2">
                  {day.sessions.map((session) => (
                    <li key={session} className="text-xs text-gray-600 bg-white rounded-lg p-2 shadow-sm">{session}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Axes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Axes de Developpement" subtitle="Un programme complet pour le developpement integral" />
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Developpement Technique', items: ['Maitrise du ballon et controle oriente', 'Technique de passe courte et longue', 'Dribble et feintes', 'Frappe de balle et finition', 'Jeu de tete'] },
              { title: 'Developpement Tactique', items: ['Comprehension des systemes de jeu', 'Transitions offensives et defensives', 'Pressing et contre-pressing', 'Jeu de position', 'Analyse video des matchs'] },
              { title: 'Preparation Physique', items: ['Endurance aerobique et anaerobique', 'Vitesse et acceleration', 'Force et puissance', 'Coordination et agilite', 'Prevention des blessures'] },
              { title: 'Suivi Scolaire & Education', items: ['Cours du matin obligatoires', 'Aide aux devoirs', 'Formation aux valeurs du sport', 'Apprentissage des langues (francais, anglais)', "Education a la nutrition et a l'hygiene de vie"] },
            ].map((section) => (
              <div key={section.title} className="bg-white rounded-xl p-8 shadow-md">
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
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Categories d'Age" subtitle="Des programmes adaptes a chaque tranche d'age" />
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { cat: 'U13', age: '11-12 ans', focus: 'Plaisir, technique individuelle, jeu reduit' },
              { cat: 'U15', age: '13-14 ans', focus: 'Developpement technique et tactique, initiation physique' },
              { cat: 'U17', age: '15-16 ans', focus: 'Perfectionnement tactique, preparation physique, competition' },
              { cat: 'U19', age: '17-18 ans', focus: 'Pre-professionnalisation, performance, placement en clubs' },
            ].map((item) => (
              <div key={item.cat} className="border-2 border-primary/20 rounded-xl p-6 hover:border-primary transition-colors">
                <div className="text-3xl font-black text-primary mb-2">{item.cat}</div>
                <div className="text-sm text-gray-500 mb-3">{item.age}</div>
                <p className="text-gray-600 text-sm">{item.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Development */}
      <section className="py-20 bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Suivi Individuel" subtitle="Chaque joueur beneficie d'un accompagnement personnalise" light />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Plan de progression', desc: 'Objectifs individuels definis en debut de saison et evalues trimestriellement.' },
              { title: 'Rapport mensuel', desc: 'Bilan technique, physique et comportemental envoye aux parents.' },
              { title: 'Video individuelle', desc: "Analyse video personnalisee pour identifier les axes d'amelioration." },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
