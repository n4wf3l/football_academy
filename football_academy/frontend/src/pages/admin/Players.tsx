import { useState, useEffect, useRef } from 'react';
import { fetchPlayers, createPlayer, updatePlayer, deletePlayer, uploadFile, fetchActiveCategories } from '../../api/endpoints';
import { useToast } from '../../contexts/ToastContext';
import { useLang } from '../../contexts/LanguageContext';
import type { Player, Category } from '../../types';

const positions = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'];
const feet = ['right', 'left', 'both'];
const footLabels: Record<string, string> = { right: 'Droit', left: 'Gauche', both: 'Les deux' };

type ViewMode = 'table' | 'grid' | 'compact';

const emptyPlayer: Partial<Player> = {
  first_name: '', last_name: '', date_of_birth: '', position: 'Attaquant',
  preferred_foot: 'right', height: null, weight: null, nationality: '',
  category: 'U17', goals: 0, assists: 0, matches_played: 0,
  bio_fr: '', bio_en: '', photo: null, highlight_video: null, is_featured: false,
};

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [form, setForm] = useState<Partial<Player>>(emptyPlayer);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Player | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    (localStorage.getItem('admin-players-view') as ViewMode) || 'table'
  );
  const [updatingStats, setUpdatingStats] = useState<Record<string, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const { t } = useLang();

  useEffect(() => {
    localStorage.setItem('admin-players-view', viewMode);
  }, [viewMode]);

  const load = () => {
    setLoading(true);
    Promise.all([fetchPlayers(), fetchActiveCategories()]).then(([p, c]) => {
      setPlayers(p);
      setCategories(c);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const filtered = players.filter((p) => {
    const matchSearch = `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyPlayer });
    setShowModal(true);
  };

  const openEdit = (player: Player) => {
    setEditing(player);
    setForm({ ...player, date_of_birth: player.date_of_birth?.split('T')[0] || '' });
    setShowModal(true);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      setForm((prev) => ({ ...prev, photo: url }));
    } catch {}
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updatePlayer(editing.id, form);
        toast.success(t('Joueur mis à jour', 'Player updated'));
      } else {
        await createPlayer(form);
        toast.success(t('Joueur créé', 'Player created'), `${form.first_name} ${form.last_name}`);
      }
      setShowModal(false);
      load();
    } catch {
      toast.error(t('Erreur', 'Error'), t('Impossible de sauvegarder le joueur', 'Could not save player'));
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deletePlayer(deleteConfirm.id);
      toast.success(t('Joueur supprimé', 'Player deleted'), `${deleteConfirm.first_name} ${deleteConfirm.last_name}`);
      setDeleteConfirm(null);
      load();
    } catch {
      toast.error(t('Erreur', 'Error'), t('Impossible de supprimer le joueur', 'Could not delete player'));
    }
  };

  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const getAge = (dob: string) => {
    if (!dob) return '-';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  // Quick stat update — optimistic UI
  const quickStat = async (player: Player, field: 'matches_played' | 'goals' | 'assists', delta: number) => {
    const key = `${player.id}-${field}`;
    if (updatingStats[key]) return;
    const newVal = Math.max(0, (player[field] || 0) + delta);
    // Optimistic update
    setPlayers((prev) => prev.map((p) => p.id === player.id ? { ...p, [field]: newVal } : p));
    setUpdatingStats((prev) => ({ ...prev, [key]: true }));
    const fieldLabels: Record<string, string> = {
      matches_played: t('match', 'match'),
      goals: t('but', 'goal'),
      assists: t('passe décisive', 'assist'),
    };
    try {
      await updatePlayer(player.id, { [field]: newVal });
      const name = `${player.first_name} ${player.last_name}`;
      if (delta > 0) {
        toast.success(name, `+1 ${fieldLabels[field]} (${newVal})`);
      } else {
        toast.info(name, `-1 ${fieldLabels[field]} (${newVal})`);
      }
    } catch {
      // Revert on error
      setPlayers((prev) => prev.map((p) => p.id === player.id ? { ...p, [field]: player[field] } : p));
      toast.error(t('Erreur', 'Error'), t('Mise à jour échouée', 'Update failed'));
    }
    setUpdatingStats((prev) => ({ ...prev, [key]: false }));
  };

  // Stat stepper component
  const StatStepper = ({ player, field, label, icon, color }: {
    player: Player; field: 'matches_played' | 'goals' | 'assists'; label: string;
    icon: React.ReactNode; color: string;
  }) => {
    const val = player[field] || 0;
    const key = `${player.id}-${field}`;
    const busy = updatingStats[key];
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={(e) => { e.stopPropagation(); quickStat(player, field, -1); }}
          disabled={busy || val === 0}
          className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all hover:scale-110 active:scale-95 bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:hover:scale-100"
          title={`-1 ${label}`}
        >
          −
        </button>
        <div className={`flex items-center gap-1 min-w-[52px] justify-center px-2 py-1 rounded-lg text-sm font-bold ${color}`}>
          {icon}
          <span className={`transition-all ${busy ? 'opacity-50' : ''}`}>{val}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); quickStat(player, field, 1); }}
          disabled={busy}
          className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all hover:scale-110 active:scale-95 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-30 disabled:hover:scale-100"
          title={`+1 ${label}`}
        >
          +
        </button>
      </div>
    );
  };

  const matchIcon = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
  const goalIcon = <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth={2}/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth={1.5}/><line x1="12" y1="2" x2="12" y2="8" stroke="currentColor" strokeWidth={1.5}/><line x1="12" y1="16" x2="12" y2="22" stroke="currentColor" strokeWidth={1.5}/><line x1="2" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth={1.5}/><line x1="16" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth={1.5}/></svg>;
  const assistIcon = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>;

  const viewModes: { mode: ViewMode; icon: string; label: string }[] = [
    { mode: 'table', icon: 'M3 10h18M3 14h18M3 18h18M3 6h18', label: t('Tableau', 'Table') },
    { mode: 'grid', icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z', label: t('Grille', 'Grid') },
    { mode: 'compact', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', label: t('Compact', 'Compact') },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-admin-fade" style={{ animationDelay: '0.05s' }}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Joueurs', 'Players')}</h1>
          <p className="text-gray-500 mt-1">{players.length} {t('joueur', 'player')}{players.length > 1 ? 's' : ''} {t('au centre', 'in center')}</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('Ajouter un joueur', 'Add player')}
        </button>
      </div>

      {/* Filters + View mode */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t('Rechercher un joueur...', 'Search a player...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterCat('')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              !filterCat ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('Tous', 'All')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCat(cat.name)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filterCat === cat.name ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex bg-gray-100 rounded-lg p-0.5 ml-auto">
          {viewModes.map((vm) => (
            <button
              key={vm.mode}
              onClick={() => setViewMode(vm.mode)}
              title={vm.label}
              className={`p-2 rounded-md transition-all ${
                viewMode === vm.mode
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-4.5 h-4.5" fill={vm.mode === 'grid' ? 'currentColor' : 'none'} stroke={vm.mode === 'grid' ? 'none' : 'currentColor'} viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={vm.icon} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* ============ TABLE VIEW ============ */}
      {viewMode === 'table' && (
        <div key={`view-table`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-admin-fade">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('Joueur', 'Player')}</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('Position', 'Position')}</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('Catégorie', 'Category')}</th>
                <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('Age', 'Age')}</th>
                <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('Matchs', 'Matches')}</th>
                <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('Buts', 'Goals')}</th>
                <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('Passes', 'Assists')}</th>
                <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('Vedette', 'Featured')}</th>
                <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((player, i) => (
                <tr key={player.id} className="hover:bg-primary/[0.03] transition-colors group animate-admin-nav-item" style={{ animationDelay: `${Math.min(i * 0.04, 0.5)}s` }}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {player.photo ? (
                          <img src={player.photo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {player.first_name[0]}{player.last_name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{player.first_name} {player.last_name}</div>
                        <div className="text-xs text-gray-500">{player.nationality || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {player.position}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{player.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-center">{getAge(player.date_of_birth)}</td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StatStepper player={player} field="matches_played" label={t('match', 'match')} icon={matchIcon} color="bg-blue-50 text-blue-700" />
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StatStepper player={player} field="goals" label={t('but', 'goal')} icon={goalIcon} color="bg-emerald-50 text-emerald-700" />
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex justify-center">
                      <StatStepper player={player} field="assists" label={t('passe', 'assist')} icon={assistIcon} color="bg-purple-50 text-purple-700" />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {player.is_featured ? (
                      <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full" title="Vedette" />
                    ) : (
                      <span className="inline-block w-3 h-3 bg-gray-200 rounded-full" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(player)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors" title={t('Modifier', 'Edit')}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => setDeleteConfirm(player)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors" title={t('Supprimer', 'Delete')}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('Aucun joueur trouvé', 'No players found')}
            </div>
          )}
        </div>
      )}

      {/* ============ GRID VIEW ============ */}
      {viewMode === 'grid' && (
        <div key={`view-grid`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((player, i) => (
            <div
              key={player.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group animate-admin-card"
              style={{ animationDelay: `${Math.min(i * 0.06, 0.5)}s` }}
            >
              {/* Card header with photo */}
              <div className="relative h-44 bg-gradient-to-br from-primary/5 to-primary/10">
                {player.photo ? (
                  <img src={player.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-black text-primary/20">{player.first_name[0]}{player.last_name[0]}</span>
                  </div>
                )}
                {/* Overlay actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(player)} className="p-1.5 rounded-lg bg-white/90 text-gray-600 hover:text-primary shadow-sm transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteConfirm(player)} className="p-1.5 rounded-lg bg-white/90 text-gray-600 hover:text-red-600 shadow-sm transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                {/* Featured badge */}
                {player.is_featured && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-yellow-400 text-[10px] font-bold text-yellow-900 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {t('Vedette', 'Featured')}
                  </div>
                )}
                {/* Position badge */}
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/90 text-xs font-semibold text-primary backdrop-blur-sm">
                  {player.position}
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{player.first_name} {player.last_name}</h3>
                    <p className="text-xs text-gray-500">{player.category} · {getAge(player.date_of_birth)} {t('ans', 'yrs')}</p>
                  </div>
                </div>

                {/* Stats with steppers */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{t('Matchs', 'Matches')}</span>
                    <StatStepper player={player} field="matches_played" label={t('match', 'match')} icon={matchIcon} color="bg-blue-50 text-blue-700" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{t('Buts', 'Goals')}</span>
                    <StatStepper player={player} field="goals" label={t('but', 'goal')} icon={goalIcon} color="bg-emerald-50 text-emerald-700" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{t('Passes', 'Assists')}</span>
                    <StatStepper player={player} field="assists" label={t('passe', 'assist')} icon={assistIcon} color="bg-purple-50 text-purple-700" />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              {t('Aucun joueur trouvé', 'No players found')}
            </div>
          )}
        </div>
      )}

      {/* ============ COMPACT VIEW ============ */}
      {viewMode === 'compact' && (
        <div key={`view-compact`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100 animate-admin-fade">
          {filtered.map((player, i) => (
            <div key={player.id} className="flex items-center gap-4 px-4 py-2.5 hover:bg-primary/[0.03] transition-colors group animate-admin-nav-item" style={{ animationDelay: `${Math.min(i * 0.03, 0.4)}s` }}>
              {/* Mini avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {player.photo ? (
                  <img src={player.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                    {player.first_name[0]}{player.last_name[0]}
                  </div>
                )}
              </div>

              {/* Name + info */}
              <div className="min-w-[140px]">
                <span className="font-semibold text-sm text-gray-900">{player.first_name} {player.last_name}</span>
                <span className="text-xs text-gray-400 ml-2">{player.category}</span>
              </div>

              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-semibold rounded-full">{player.position}</span>

              {/* Stats */}
              <div className="flex items-center gap-4 ml-auto">
                <StatStepper player={player} field="matches_played" label={t('match', 'match')} icon={matchIcon} color="bg-blue-50 text-blue-700" />
                <StatStepper player={player} field="goals" label={t('but', 'goal')} icon={goalIcon} color="bg-emerald-50 text-emerald-700" />
                <StatStepper player={player} field="assists" label={t('passe', 'assist')} icon={assistIcon} color="bg-purple-50 text-purple-700" />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(player)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => setDeleteConfirm(player)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              {t('Aucun joueur trouvé', 'No players found')}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? t('Modifier le joueur', 'Edit player') : t('Nouveau joueur', 'New player')}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Photo upload */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300">
                  {form.photo ? (
                    <img src={form.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handlePhoto} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Upload...' : t('Choisir une photo', 'Choose photo')}
                  </button>
                  {form.photo && (
                    <button
                      type="button"
                      onClick={() => set('photo', null)}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      {t('Supprimer', 'Remove')}
                    </button>
                  )}
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG ou WebP. Max 5 MB.</p>
                </div>
              </div>

              {/* Identity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Prénom', 'First name')} *</label>
                  <input type="text" value={form.first_name || ''} onChange={(e) => set('first_name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Nom', 'Last name')} *</label>
                  <input type="text" value={form.last_name || ''} onChange={(e) => set('last_name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Date de naissance', 'Date of birth')} *</label>
                  <input type="date" value={form.date_of_birth || ''} onChange={(e) => set('date_of_birth', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Nationalité', 'Nationality')}</label>
                  <input type="text" value={form.nationality || ''} onChange={(e) => set('nationality', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
              </div>

              {/* Football info */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                  <select value={form.position || ''} onChange={(e) => set('position', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                    {positions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Catégorie', 'Category')} *</label>
                  <select value={form.category || ''} onChange={(e) => set('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                    {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Pied fort', 'Preferred foot')}</label>
                  <select value={form.preferred_foot || 'right'} onChange={(e) => set('preferred_foot', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                    {feet.map((f) => <option key={f} value={f}>{footLabels[f]}</option>)}
                  </select>
                </div>
              </div>

              {/* Physical */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Taille (cm)', 'Height (cm)')}</label>
                  <input type="number" value={form.height ?? ''} onChange={(e) => set('height', e.target.value ? Number(e.target.value) : null)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Poids (kg)', 'Weight (kg)')}</label>
                  <input type="number" value={form.weight ?? ''} onChange={(e) => set('weight', e.target.value ? Number(e.target.value) : null)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Matchs joués', 'Matches played')}</label>
                  <input type="number" value={form.matches_played ?? 0} onChange={(e) => set('matches_played', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Buts', 'Goals')}</label>
                  <input type="number" value={form.goals ?? 0} onChange={(e) => set('goals', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Passes décisives', 'Assists')}</label>
                  <input type="number" value={form.assists ?? 0} onChange={(e) => set('assists', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Biographie (FR)', 'Biography (FR)')}</label>
                <textarea value={form.bio_fr || ''} onChange={(e) => set('bio_fr', e.target.value)} rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Vidéo highlights (URL YouTube/Vimeo)', 'Highlight video (YouTube/Vimeo URL)')}</label>
                <input type="text" value={form.highlight_video || ''} onChange={(e) => set('highlight_video', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="https://youtube.com/embed/..." />
              </div>

              {/* Featured */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={!!form.is_featured} onChange={(e) => set('is_featured', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-gray-700">{t("Joueur vedette (affiché sur la page d'accueil)", 'Featured player (shown on homepage)')}</span>
              </label>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors">
                {t('Annuler', 'Cancel')}
              </button>
              <button onClick={handleSave} disabled={saving}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50">
                {saving ? t('Sauvegarde...', 'Saving...') : editing ? t('Mettre à jour', 'Update') : t('Créer le joueur', 'Create player')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('Supprimer ce joueur ?', 'Delete this player?')}</h3>
              <p className="text-gray-500 text-sm mb-6">
                <strong>{deleteConfirm.first_name} {deleteConfirm.last_name}</strong> {t('sera supprimé définitivement.', 'will be permanently deleted.')}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  {t('Annuler', 'Cancel')}
                </button>
                <button onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                  {t('Supprimer', 'Delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
