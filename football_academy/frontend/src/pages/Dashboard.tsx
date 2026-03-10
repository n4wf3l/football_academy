import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlayers, fetchStaff, fetchPartners, fetchTournaments, fetchGallery, fetchTrainingSessions, fetchActiveCategories } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import type { Player, Staff, Partner, Tournament, GalleryItem, TrainingSession, Category } from '../types';

const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const POSITION_COLORS: Record<string, string> = {
  Gardien: '#6366f1',
  Defenseur: '#22c55e',
  Milieu: '#eab308',
  Attaquant: '#ef4444',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { isDark } = useTheme();
  const [players, setPlayers] = useState<Player[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [catList, setCatList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchPlayers(), fetchStaff(), fetchPartners(),
      fetchTournaments(), fetchGallery(), fetchTrainingSessions(),
      fetchActiveCategories(),
    ]).then(([p, s, pa, t, g, ss, cats]) => {
      setPlayers(p); setStaff(s); setPartners(pa);
      setTournaments(t); setGallery(g); setSessions(ss);
      setCatList(cats);
      setLoading(false);
    });
  }, []);

  // Style helpers
  const card = isDark
    ? 'bg-slate-900 border-slate-800'
    : 'bg-white border-gray-100';
  const cardHover = isDark
    ? 'hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/50'
    : 'hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-400';
  const textSub = isDark ? 'text-slate-500' : 'text-gray-300';
  const subtleBg = isDark ? 'bg-slate-800' : 'bg-gray-50';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className={`text-sm ${textMuted}`}>Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  // Computed stats
  const totalGoals = players.reduce((s, p) => s + p.goals, 0);
  const totalAssists = players.reduce((s, p) => s + p.assists, 0);
  const totalMatches = players.reduce((s, p) => s + p.matches_played, 0);
  const avgAge = players.length
    ? Math.round(players.reduce((s, p) => {
        const age = p.date_of_birth ? (Date.now() - new Date(p.date_of_birth).getTime()) / (365.25 * 24 * 3600000) : 0;
        return s + age;
      }, 0) / players.length)
    : 0;

  const upcomingTournaments = tournaments.filter((t) => t.status === 'upcoming');
  const ongoingTournaments = tournaments.filter((t) => t.status === 'ongoing');

  // Players by category
  const catData = catList.map((c) => ({
    label: c.name,
    count: players.filter((p) => p.category === c.name).length,
  }));
  const maxCat = Math.max(...catData.map((c) => c.count), 1);

  // Players by position
  const positions = ['Gardien', 'Defenseur', 'Milieu', 'Attaquant'];
  const posData = positions.map((pos) => ({
    label: pos,
    count: players.filter((p) => p.position === pos).length,
    color: POSITION_COLORS[pos],
  }));
  const totalPos = posData.reduce((s, p) => s + p.count, 0) || 1;

  // Top scorers
  const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 5);

  // Sessions per day
  const weekData = DAYS_SHORT.map((d, i) => ({
    label: d,
    count: sessions.filter((s) => s.day_of_week === i).length,
  }));
  const maxWeek = Math.max(...weekData.map((d) => d.count), 1);

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon apres-midi' : 'Bonsoir';

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${text}`}>
            {greeting}, <span className="text-primary">{user?.name || 'Admin'}</span>
          </h1>
          <p className={`text-sm mt-1 ${textMuted}`}>
            Voici un apercu de {settings.academy_name}
          </p>
        </div>
        <div className={`hidden sm:flex items-center gap-2 text-xs ${textMuted} ${subtleBg} rounded-lg px-3 py-2`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Joueurs', value: players.length, sub: `${avgAge} ans de moyenne`,
            icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
            href: '/dashboard/players',
          },
          {
            label: 'Staff', value: staff.length, sub: `${new Set(staff.map((s) => s.role)).size} roles differents`,
            icon: 'M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342',
            href: '/dashboard/staff',
          },
          {
            label: 'Partenaires', value: partners.length, sub: `${partners.filter((p) => p.type === 'Club partenaire').length} clubs partenaires`,
            icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418',
            href: '/dashboard/partners',
          },
          {
            label: 'Tournois', value: tournaments.length,
            sub: upcomingTournaments.length
              ? `${upcomingTournaments.length} a venir`
              : ongoingTournaments.length ? `${ongoingTournaments.length} en cours` : 'Aucun a venir',
            icon: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.77 0',
            href: '/dashboard/tournaments',
          },
        ].map((s) => (
          <Link
            key={s.label}
            to={s.href}
            className={`group rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-0.5 ${card} ${cardHover}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                isDark ? 'bg-primary/15' : 'bg-primary/10'
              }`}>
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <svg className={`w-4 h-4 group-hover:translate-x-0.5 transition-all ${textSub}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
            <div className={`text-3xl font-bold ${text}`}>{s.value}</div>
            <div className={`text-xs mt-0.5 ${textMuted}`}>{s.label}</div>
            <div className={`text-[11px] mt-2 ${textSub}`}>{s.sub}</div>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Performance overview - 2 cols */}
        <div className={`lg:col-span-2 rounded-2xl border p-6 ${card}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`font-bold ${text}`}>Performance globale</h2>
              <p className={`text-xs mt-0.5 ${textMuted}`}>Statistiques cumulees de tous les joueurs</p>
            </div>
          </div>

          {/* Stats row - clean, monochrome with primary accent */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Buts marques', value: totalGoals, icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Passes decisives', value: totalAssists, icon: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5' },
              { label: 'Matchs joues', value: totalMatches, icon: 'M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-50/80 border-gray-100'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${isDark ? 'bg-primary/15' : 'bg-primary/10'}`}>
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <div className={`text-2xl font-bold ${text}`}>{stat.value}</div>
                <div className={`text-[11px] mt-0.5 ${textMuted}`}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Category bar chart */}
          <div className="mb-1">
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Joueurs par categorie</h3>
            <div className="space-y-3">
              {catData.map((cat) => (
                <div key={cat.label} className="flex items-center gap-3">
                  <span className={`text-xs font-bold w-8 ${textMuted}`}>{cat.label}</span>
                  <div className={`flex-1 h-8 rounded-lg overflow-hidden relative ${subtleBg}`}>
                    <div
                      className="h-full bg-primary/80 rounded-lg transition-all duration-1000 ease-out flex items-center"
                      style={{ width: `${Math.max((cat.count / maxCat) * 100, 8)}%` }}
                    >
                      <span className="text-[11px] font-bold text-white ml-3 drop-shadow-sm">{cat.count} joueurs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Position donut */}
          <div className={`rounded-2xl border p-6 ${card}`}>
            <h2 className={`font-bold mb-4 ${text}`}>Repartition par poste</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 shrink-0">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(${posData.map((p, i) => {
                      const start = posData.slice(0, i).reduce((s, x) => s + x.count, 0) / totalPos * 360;
                      const end = posData.slice(0, i + 1).reduce((s, x) => s + x.count, 0) / totalPos * 360;
                      return `${p.color} ${start}deg ${end}deg`;
                    }).join(', ')})`,
                  }}
                />
                <div className={`absolute inset-2.5 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${text}`}>{players.length}</div>
                    <div className={`text-[9px] uppercase tracking-wider ${textMuted}`}>Total</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2.5 flex-1">
                {posData.map((p) => (
                  <div key={p.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{p.label}</span>
                    </div>
                    <span className={`text-xs font-bold ${text}`}>{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly schedule mini chart */}
          <div className={`rounded-2xl border p-6 ${card}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-bold ${text}`}>Seances / semaine</h2>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{sessions.length} total</span>
            </div>
            <div className="flex items-end gap-2 h-24">
              {weekData.map((d) => (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`w-full rounded-md overflow-hidden flex flex-col justify-end ${subtleBg}`} style={{ height: '80px' }}>
                    <div
                      className={`w-full rounded-md transition-all duration-700 ${d.count > 0 ? 'bg-primary/70' : isDark ? 'bg-slate-700' : 'bg-gray-100'}`}
                      style={{ height: `${Math.max((d.count / maxWeek) * 100, d.count > 0 ? 15 : 4)}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${textMuted}`}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top scorers */}
        <div className={`rounded-2xl border p-6 ${card}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-bold ${text}`}>Meilleurs buteurs</h2>
            <Link to="/dashboard/players" className="text-xs text-primary hover:text-primary-light transition-colors font-medium">
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {topScorers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  i === 0
                    ? 'bg-amber-100 text-amber-700'
                    : i === 1
                      ? isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                      : i === 2
                        ? 'bg-orange-50 text-orange-600'
                        : isDark ? 'bg-slate-800 text-slate-500' : 'bg-gray-50 text-gray-400'
                }`}>
                  {i + 1}
                </span>
                {p.photo ? (
                  <img src={p.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {p.first_name[0]}{p.last_name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${text}`}>{p.first_name} {p.last_name}</div>
                  <div className={`text-[11px] ${textMuted}`}>{p.position} · {p.category}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${text}`}>{p.goals}</div>
                  <div className={`text-[10px] ${textMuted}`}>buts</div>
                </div>
              </div>
            ))}
            {topScorers.length === 0 && (
              <p className={`text-sm text-center py-4 ${textSub}`}>Aucun joueur</p>
            )}
          </div>
        </div>

        {/* Upcoming tournaments */}
        <div className={`rounded-2xl border p-6 ${card}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-bold ${text}`}>Prochains tournois</h2>
            <Link to="/dashboard/tournaments" className="text-xs text-primary hover:text-primary-light transition-colors font-medium">
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {[...ongoingTournaments, ...upcomingTournaments].slice(0, 4).map((t) => {
              const isOngoing = t.status === 'ongoing';
              return (
                <div key={t.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-gray-50/80 hover:bg-gray-50'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isOngoing
                      ? isDark ? 'bg-green-500/15 text-green-400' : 'bg-green-100 text-green-600'
                      : isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${text}`}>{t.name}</div>
                    <div className={`text-[11px] mt-0.5 ${textMuted}`}>{t.location} · {t.category}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isOngoing
                          ? isDark ? 'bg-green-500/15 text-green-400' : 'bg-green-100 text-green-700'
                          : isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isOngoing && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                        {isOngoing ? 'En cours' : 'A venir'}
                      </span>
                      <span className={`text-[10px] ${textSub}`}>
                        {new Date(t.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {upcomingTournaments.length === 0 && ongoingTournaments.length === 0 && (
              <p className={`text-sm text-center py-4 ${textSub}`}>Aucun tournoi a venir</p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className={`rounded-2xl border p-6 ${card}`}>
          <h2 className={`font-bold mb-4 ${text}`}>Actions rapides</h2>
          <div className="space-y-2">
            {[
              { label: 'Ajouter un joueur', href: '/dashboard/players', icon: 'M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z' },
              { label: 'Gerer le planning', href: '/dashboard/planning', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
              { label: 'Ajouter un media', href: '/dashboard/gallery', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75z' },
              { label: 'Creer un tournoi', href: '/dashboard/tournaments', icon: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172' },
              { label: 'Parametres du site', href: '/dashboard/settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
            ].map((a) => (
              <Link
                key={a.label}
                to={a.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
                  isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${
                  isDark ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'
                }`}>
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
                  </svg>
                </div>
                <span className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>{a.label}</span>
                <svg className={`w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${textSub}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Mini counts */}
          <div className={`mt-4 pt-4 border-t flex gap-3 ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
            <div className={`flex-1 rounded-xl p-3 text-center ${subtleBg}`}>
              <div className={`text-lg font-bold ${text}`}>{gallery.filter((g) => g.type === 'photo').length}</div>
              <div className={`text-[10px] uppercase tracking-wider ${textMuted}`}>Photos</div>
            </div>
            <div className={`flex-1 rounded-xl p-3 text-center ${subtleBg}`}>
              <div className={`text-lg font-bold ${text}`}>{gallery.filter((g) => g.type === 'video').length}</div>
              <div className={`text-[10px] uppercase tracking-wider ${textMuted}`}>Videos</div>
            </div>
            <div className={`flex-1 rounded-xl p-3 text-center ${subtleBg}`}>
              <div className={`text-lg font-bold ${text}`}>{sessions.length}</div>
              <div className={`text-[10px] uppercase tracking-wider ${textMuted}`}>Seances</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
