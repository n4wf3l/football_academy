import { useState, useEffect, useRef } from 'react';
import { fetchPlayers, createPlayer, updatePlayer, deletePlayer, uploadFile, fetchActiveCategories } from '../../api/endpoints';
import { useToast } from '../../contexts/ToastContext';
import type { Player, Category } from '../../types';

const positions = ['Gardien', 'Defenseur', 'Milieu', 'Attaquant'];
const feet = ['right', 'left', 'both'];
const footLabels: Record<string, string> = { right: 'Droit', left: 'Gauche', both: 'Les deux' };

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
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

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
        toast.success('Joueur mis a jour');
      } else {
        await createPlayer(form);
        toast.success('Joueur cree', `${form.first_name} ${form.last_name} a ete ajoute`);
      }
      setShowModal(false);
      load();
    } catch {
      toast.error('Erreur', 'Impossible de sauvegarder le joueur');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deletePlayer(deleteConfirm.id);
      toast.success('Joueur supprime', `${deleteConfirm.first_name} ${deleteConfirm.last_name}`);
      setDeleteConfirm(null);
      load();
    } catch {
      toast.error('Erreur', 'Impossible de supprimer le joueur');
    }
  };

  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const getAge = (dob: string) => {
    if (!dob) return '-';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Joueurs</h1>
          <p className="text-gray-500 mt-1">{players.length} joueur{players.length > 1 ? 's' : ''} au centre</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un joueur
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un joueur..."
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
            Tous
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
      </div>

      {/* Players table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joueur</th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categorie</th>
              <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
              <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">MJ</th>
              <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Buts</th>
              <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Passes</th>
              <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vedette</th>
              <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50 transition-colors">
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
                <td className="py-3 px-4 text-sm text-gray-700 text-center">{player.matches_played}</td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-center">{player.goals}</td>
                <td className="py-3 px-4 text-sm text-gray-700 text-center">{player.assists}</td>
                <td className="py-3 px-4 text-center">
                  {player.is_featured ? (
                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full" title="Vedette" />
                  ) : (
                    <span className="inline-block w-3 h-3 bg-gray-200 rounded-full" />
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(player)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors" title="Modifier">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => setDeleteConfirm(player)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors" title="Supprimer">
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
            Aucun joueur trouve
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Modifier le joueur' : 'Nouveau joueur'}
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
                    {uploading ? 'Upload...' : 'Choisir une photo'}
                  </button>
                  {form.photo && (
                    <button
                      type="button"
                      onClick={() => set('photo', null)}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  )}
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG ou WebP. Max 5 MB.</p>
                </div>
              </div>

              {/* Identity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prenom *</label>
                  <input type="text" value={form.first_name || ''} onChange={(e) => set('first_name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input type="text" value={form.last_name || ''} onChange={(e) => set('last_name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
                  <input type="date" value={form.date_of_birth || ''} onChange={(e) => set('date_of_birth', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationalite</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categorie *</label>
                  <select value={form.category || ''} onChange={(e) => set('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                    {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pied fort</label>
                  <select value={form.preferred_foot || 'right'} onChange={(e) => set('preferred_foot', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                    {feet.map((f) => <option key={f} value={f}>{footLabels[f]}</option>)}
                  </select>
                </div>
              </div>

              {/* Physical */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taille (cm)</label>
                  <input type="number" value={form.height ?? ''} onChange={(e) => set('height', e.target.value ? Number(e.target.value) : null)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                  <input type="number" value={form.weight ?? ''} onChange={(e) => set('weight', e.target.value ? Number(e.target.value) : null)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matchs joues</label>
                  <input type="number" value={form.matches_played ?? 0} onChange={(e) => set('matches_played', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buts</label>
                  <input type="number" value={form.goals ?? 0} onChange={(e) => set('goals', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passes decisives</label>
                  <input type="number" value={form.assists ?? 0} onChange={(e) => set('assists', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biographie (FR)</label>
                <textarea value={form.bio_fr || ''} onChange={(e) => set('bio_fr', e.target.value)} rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video highlights (URL YouTube/Vimeo)</label>
                <input type="text" value={form.highlight_video || ''} onChange={(e) => set('highlight_video', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="https://youtube.com/embed/..." />
              </div>

              {/* Featured */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={!!form.is_featured} onChange={(e) => set('is_featured', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-gray-700">Joueur vedette (affiche sur la page d'accueil)</span>
              </label>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50">
                {saving ? 'Sauvegarde...' : editing ? 'Mettre a jour' : 'Creer le joueur'}
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer ce joueur ?</h3>
              <p className="text-gray-500 text-sm mb-6">
                <strong>{deleteConfirm.first_name} {deleteConfirm.last_name}</strong> sera supprime definitivement. Cette action est irreversible.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
