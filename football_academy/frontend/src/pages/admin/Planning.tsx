import { useState, useEffect, useRef } from 'react';
import {
  fetchTrainingSessions, createTrainingSession, updateTrainingSession,
  deleteTrainingSession, reorderTrainingSessions,
} from '../../api/endpoints';
import type { TrainingSession } from '../../types';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const COLORS = [
  { value: 'green', label: 'Vert', bg: 'bg-green-100 border-green-300 text-green-800' },
  { value: 'blue', label: 'Bleu', bg: 'bg-blue-100 border-blue-300 text-blue-800' },
  { value: 'orange', label: 'Orange', bg: 'bg-orange-100 border-orange-300 text-orange-800' },
  { value: 'purple', label: 'Violet', bg: 'bg-purple-100 border-purple-300 text-purple-800' },
  { value: 'red', label: 'Rouge', bg: 'bg-red-100 border-red-300 text-red-800' },
  { value: 'gray', label: 'Gris', bg: 'bg-gray-100 border-gray-300 text-gray-800' },
];

const colorClass = (color: string) => COLORS.find((c) => c.value === color)?.bg || COLORS[0].bg;

const emptySession: Partial<TrainingSession> = {
  day_of_week: 0, start_time: '16:00', end_time: '18:00', title: '',
  description: '', category: 'Tous', location: '', coach: '', color: 'green', sort_order: 0,
};

export default function Planning() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TrainingSession | null>(null);
  const [form, setForm] = useState<Partial<TrainingSession>>(emptySession);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<TrainingSession | null>(null);
  const dragItem = useRef<TrainingSession | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetchTrainingSessions().then((data) => {
      setSessions(data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const sessionsForDay = (day: number) =>
    sessions.filter((s) => s.day_of_week === day).sort((a, b) => a.sort_order - b.sort_order || a.start_time.localeCompare(b.start_time));

  const openCreate = (day: number = 0) => {
    setEditing(null);
    setForm({ ...emptySession, day_of_week: day });
    setShowModal(true);
  };

  const openEdit = (session: TrainingSession) => {
    setEditing(session);
    setForm({ ...session });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateTrainingSession(editing.id, form);
      } else {
        await createTrainingSession(form);
      }
      setShowModal(false);
      load();
    } catch {}
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteTrainingSession(deleteConfirm.id);
      setDeleteConfirm(null);
      load();
    } catch {}
  };

  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  // Drag & Drop
  const handleDragStart = (session: TrainingSession) => {
    dragItem.current = session;
  };

  const handleDragOver = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    setDragOverDay(day);
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = async (e: React.DragEvent, targetDay: number) => {
    e.preventDefault();
    setDragOverDay(null);
    const item = dragItem.current;
    if (!item || item.day_of_week === targetDay) return;

    // Optimistic update
    const updated = sessions.map((s) =>
      s.id === item.id ? { ...s, day_of_week: targetDay } : s
    );
    setSessions(updated);

    // Build reorder payload
    const reorderData = updated.map((s) => ({
      id: s.id,
      day_of_week: s.day_of_week,
      sort_order: s.sort_order,
    }));

    try {
      await reorderTrainingSessions(reorderData);
    } catch {
      load(); // rollback
    }
    dragItem.current = null;
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planning Hebdomadaire</h1>
          <p className="text-gray-500 mt-1">Glissez-deposez les seances pour les reorganiser</p>
        </div>
        <button
          onClick={() => openCreate(0)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter une seance
        </button>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-7 gap-3">
        {DAYS.map((day, idx) => (
          <div
            key={day}
            className={`rounded-xl border-2 transition-colors min-h-[300px] ${
              dragOverDay === idx
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 bg-white'
            }`}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, idx)}
          >
            {/* Day header */}
            <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-sm text-gray-900">{day}</span>
              <button
                onClick={() => openCreate(idx)}
                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                title="Ajouter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Sessions */}
            <div className="p-2 space-y-2">
              {sessionsForDay(idx).map((session) => (
                <div
                  key={session.id}
                  draggable
                  onDragStart={() => handleDragStart(session)}
                  onClick={() => openEdit(session)}
                  className={`rounded-lg border p-2.5 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${colorClass(session.color)}`}
                >
                  <div className="font-semibold text-xs leading-tight">{session.title}</div>
                  <div className="text-[10px] opacity-75 mt-1">
                    {session.start_time} - {session.end_time}
                  </div>
                  {session.category && (
                    <div className="text-[10px] opacity-60 mt-0.5">{session.category}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {COLORS.map((c) => (
          <div key={c.value} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm border ${c.bg}`} />
            <span className="text-xs text-gray-500">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Modifier la seance' : 'Nouvelle seance'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input type="text" value={form.title || ''} onChange={(e) => set('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jour *</label>
                  <select value={form.day_of_week ?? 0} onChange={(e) => set('day_of_week', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                    {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                  <select value={form.category || 'Tous'} onChange={(e) => set('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                    {['Tous', 'U13', 'U15', 'U17', 'U19', 'U17-U19', 'U13-U15'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Debut *</label>
                  <input type="time" value={form.start_time || ''} onChange={(e) => set('start_time', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin *</label>
                  <input type="time" value={form.end_time || ''} onChange={(e) => set('end_time', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                  <input type="text" value={form.location || ''} onChange={(e) => set('location', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entraineur</label>
                  <input type="text" value={form.coach || ''} onChange={(e) => set('coach', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description || ''} onChange={(e) => set('description', e.target.value)} rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => set('color', c.value)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${c.bg} ${
                        form.color === c.value ? 'ring-2 ring-primary ring-offset-2 scale-110' : ''
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-between">
              <div>
                {editing && (
                  <button onClick={() => { setShowModal(false); setDeleteConfirm(editing); }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium">
                    Supprimer cette seance
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors">
                  Annuler
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50">
                  {saving ? 'Sauvegarde...' : editing ? 'Mettre a jour' : 'Creer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer cette seance ?</h3>
              <p className="text-gray-500 text-sm mb-6">
                <strong>{deleteConfirm.title}</strong> ({DAYS[deleteConfirm.day_of_week]}) sera supprimee definitivement.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
                  Annuler
                </button>
                <button onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold">
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
