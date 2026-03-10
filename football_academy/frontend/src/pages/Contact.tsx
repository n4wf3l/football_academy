import { useState, useEffect } from 'react';
import { sendContact, fetchPartners } from '../api/endpoints';
import { useSettings } from '../contexts/SettingsContext';
import { useLang } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import Reveal from '../components/Reveal';
import type { ContactForm, Partner } from '../types';

export default function Contact() {
  const { settings } = useSettings();
  const { lang, t } = useLang();
  const toast = useToast();
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetchPartners().then(setPartners);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErrors({});
    try {
      await sendContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success(
        t('Message envoye', 'Message sent'),
        t('Nous vous repondrons dans les plus brefs delais', 'We will respond as soon as possible')
      );
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
      toast.error(t('Erreur', 'Error'), t("Impossible d'envoyer le message", 'Failed to send message'));
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
          <h1 className="animate-page-hero text-4xl md:text-5xl font-black mb-4">{t('Contactez-nous', 'Contact Us')}</h1>
          <p className="animate-page-hero-sub text-xl text-gray-300">{t('Clubs, scouts, parents ou partenaires, ecrivez-nous', 'Clubs, scouts, parents or partners, write to us')}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Form */}
            <Reveal direction="left">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('Envoyez-nous un message', 'Send us a message')}</h2>

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
                    {t('Votre message a ete envoye avec succes. Nous vous repondrons dans les plus brefs delais.', 'Your message has been sent successfully. We will respond as soon as possible.')}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('Nom complet', 'Full Name')}</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder={t('Votre nom', 'Your name')}
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
                      placeholder={t('votre@email.com', 'your@email.com')}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('Sujet', 'Subject')}</label>
                    <select
                      value={form.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                      <option value="">{t('Choisir un sujet', 'Choose a subject')}</option>
                      <option value="partnership">{t('Partenariat club', 'Club Partnership')}</option>
                      <option value="scouting">{t('Scouting / Recrutement', 'Scouting / Recruitment')}</option>
                      <option value="inscription">{t('Inscription joueur', 'Player Registration')}</option>
                      <option value="tournament">{t('Tournoi / Evenement', 'Tournament / Event')}</option>
                      <option value="other">{t('Autre', 'Other')}</option>
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
                      placeholder={t('Votre message...', 'Your message...')}
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message[0]}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {sending ? t('Envoi en cours...', 'Sending...') : t('Envoyer le message', 'Send message')}
                  </button>
                </form>
              </div>
            </Reveal>

            {/* Contact Info */}
            <Reveal direction="right" delay={0.2}>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('Informations', 'Information')}</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('Adresse', 'Address')}</h3>
                      <p className="text-gray-600 text-sm mt-1">{settings.contact_address || t('Adresse a completer', 'Address to be completed')}</p>
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
                      <p className="text-gray-600 text-sm mt-1">{settings.contact_email || 'contact@football-academy.com'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('Telephone', 'Phone')}</h3>
                      <p className="text-gray-600 text-sm mt-1">{settings.contact_phone || '+32 XXX XXX XXX'}</p>
                    </div>
                  </div>
                </div>

                {partners.length > 0 && (
                  <div className="mt-12 bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">{t('Nos partenaires', 'Our partners')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {partners.map((partner) => (
                        <div key={partner.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors">
                          {partner.logo ? (
                            <img src={partner.logo} alt={partner.name} className="w-8 h-8 object-contain flex-shrink-0" />
                          ) : (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <span className="text-sm text-gray-700 font-medium truncate block">{partner.name}</span>
                            <span className="text-xs text-gray-400">{lang === 'en' ? partner.description_en : partner.description_fr}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
