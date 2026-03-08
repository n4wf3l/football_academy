import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTournaments } from '../api/endpoints';
import type { Tournament } from '../types';
import SectionTitle from '../components/SectionTitle';

const statusLabels: Record<Tournament['status'], { label: string; color: string }> = {
  upcoming: { label: 'A venir', color: 'bg-blue-100 text-blue-800' },
  ongoing: { label: 'En cours', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Termine', color: 'bg-gray-100 text-gray-800' },
};

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments().then((data) => { setTournaments(data); setLoading(false); });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <>
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Tournois & Evenements</h1>
          <p className="text-xl text-gray-300">Journees de detection, tournois et matchs amicaux internationaux</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tournaments.length > 0 ? (
            <div className="space-y-6">
              {tournaments.map((t) => (
                <div key={t.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0 text-center bg-primary/5 rounded-xl p-4 w-24">
                    <div className="text-2xl font-black text-primary">{new Date(t.start_date).getDate()}</div>
                    <div className="text-sm text-gray-500">{new Date(t.start_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{t.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[t.status].color}`}>
                        {statusLabels[t.status].label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{t.category} | {t.location}</p>
                    {t.description_fr && <p className="text-gray-600 text-sm">{t.description_fr}</p>}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(t.start_date).toLocaleDateString('fr-FR')} - {new Date(t.end_date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Aucun evenement programme pour le moment.</p>
              <p className="text-gray-400 text-sm mt-2">Les prochains tournois et journees de detection seront annonces ici.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Pour les Scouts & Clubs" subtitle="Nous invitons les recruteurs a nos evenements" />
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 mb-6">
              Si vous etes un scout ou un directeur de recrutement et souhaitez assister a nos tournois
              ou organiser une journee de detection, contactez-nous.
            </p>
            <Link to="/contact" className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
