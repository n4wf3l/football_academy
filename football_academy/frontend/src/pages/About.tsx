import { useEffect, useState } from 'react';
import { fetchStaff, fetchPartners } from '../api/endpoints';
import type { Staff, Partner } from '../types';
import SectionTitle from '../components/SectionTitle';

export default function About() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetchStaff().then(setStaff);
    fetchPartners().then(setPartners);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Notre Centre de Formation</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Un projet sportif ambitieux au service du developpement des jeunes talents africains.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Vision</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Devenir un centre de reference en Afrique pour la formation de jeunes footballeurs capables d'integrer les meilleurs clubs europeens et africains.</p>
                <p>Nous croyons que chaque jeune talent merite une chance de realiser son reve, avec un accompagnement professionnel complet.</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nos Objectifs</h2>
              <ul className="space-y-4">
                {[
                  'Former des joueurs techniquement et tactiquement competents',
                  'Assurer un suivi scolaire et educatif de qualite',
                  'Developper les qualites physiques et mentales',
                  'Placer les joueurs dans des clubs professionnels',
                  'Former des hommes responsables et disciplines',
                ].map((obj) => (
                  <li key={obj} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Methodologie d'Entrainement" subtitle="Une approche structuree et moderne de la formation" />
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: 'Technique', desc: 'Maitrise du ballon, dribble, passes, frappes', color: 'from-green-500 to-green-700' },
              { title: 'Tactique', desc: 'Comprehension du jeu, placement, transitions', color: 'from-blue-500 to-blue-700' },
              { title: 'Physique', desc: 'Endurance, vitesse, force, coordination', color: 'from-orange-500 to-orange-700' },
              { title: 'Mental', desc: "Concentration, confiance, esprit d'equipe", color: 'from-purple-500 to-purple-700' },
            ].map((item) => (
              <div key={item.title} className={`bg-gradient-to-br ${item.color} rounded-xl p-6 text-white`}>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Nos Infrastructures" subtitle="Des installations de qualite pour un entrainement optimal" />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Terrains d'entrainement", desc: 'Terrains en gazon naturel et synthetique pour les seances quotidiennes.' },
              { title: 'Internat', desc: "Chambres, refectoire et salle d'etude pour l'hebergement des joueurs." },
              { title: 'Salle de musculation', desc: 'Equipement moderne pour la preparation physique et la reeducation.' },
              { title: "Salle d'etude", desc: "Espace dedie au suivi scolaire et a l'education des joueurs." },
              { title: 'Vestiaires', desc: 'Vestiaires equipes avec douches pour le confort des joueurs.' },
              { title: 'Bureau medical', desc: 'Suivi medical regulier et prise en charge des blessures.' },
            ].map((infra) => (
              <div key={infra.title} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{infra.title}</h3>
                <p className="text-gray-500 text-sm">{infra.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Notre Encadrement" subtitle="Une equipe qualifiee et passionnee" />
          {staff.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {staff.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-md overflow-hidden text-center">
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
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Encadrement a venir...</p>
          )}
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Nos Partenaires" subtitle="Ils nous font confiance" />
          {partners.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {partners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-center p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="max-h-16" />
                  ) : (
                    <span className="text-gray-600 font-semibold">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Partenaires a venir...</p>
          )}
        </div>
      </section>
    </>
  );
}
