import { useState } from 'react';
import { sendContact } from '../api/endpoints';
import type { ContactForm } from '../types';

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErrors({});
    try {
      await sendContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    } finally {
      setSending(false);
    }
  };

  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-300">Clubs, scouts, parents ou partenaires, ecrivez-nous</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
                  Votre message a ete envoye avec succes. Nous vous repondrons dans les plus brefs delais.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Votre nom"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                  <select
                    value={form.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="">Choisir un sujet</option>
                    <option value="partnership">Partenariat club</option>
                    <option value="scouting">Scouting / Recrutement</option>
                    <option value="inscription">Inscription joueur</option>
                    <option value="tournament">Tournoi / Evenement</option>
                    <option value="other">Autre</option>
                  </select>
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Votre message..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message[0]}</p>}
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Adresse</h3>
                    <p className="text-gray-600 text-sm mt-1">Centre de Formation Football Academy<br />Adresse a completer</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600 text-sm mt-1">contact@football-academy.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Telephone</h3>
                    <p className="text-gray-600 text-sm mt-1">+32 XXX XXX XXX</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Clubs partenaires cibles</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'RSC Anderlecht', 'PSV Eindhoven', "Borussia M'gladbach", 'KRC Genk',
                    'Club Brugge', 'Standard de Liege', 'Ajax Amsterdam', 'FC Metz',
                  ].map((club) => (
                    <div key={club} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {club}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
