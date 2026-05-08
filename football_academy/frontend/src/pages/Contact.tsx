import { useState, useEffect } from 'react';
import { sendContact, fetchPartners } from '../api/endpoints';
import { useSettings } from '../contexts/SettingsContext';
import { useLang } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import Reveal from '../components/Reveal';
import MapEmbed from '../components/MapEmbed';
import type { ContactForm, Partner } from '../types';

const ACADEMY_LAT = -2.5446;
const ACADEMY_LNG = 15.5;
const ACADEMY_CITY = 'Ngania, Dépt. des Plateaux, Congo';

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
        t('Message envoyé', 'Message sent'),
        t('Nous vous répondrons dans les plus brefs délais', 'We will respond as soon as possible')
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

  const address = settings.contact_address || ACADEMY_CITY;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${ACADEMY_LAT},${ACADEMY_LNG}`;
  const popupHtml = `
    <div style="font-family:Inter,system-ui,sans-serif;min-width:180px">
      <strong style="display:block;font-size:14px;color:#111827;margin-bottom:4px">${settings.academy_name || 'Football Academy'}</strong>
      <span style="font-size:12px;color:#6b7280">${address}</span>
    </div>`;

  return (
    <>
      <section className="bg-gradient-to-br from-dark to-primary-dark text-white py-20 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="animate-page-hero text-4xl md:text-5xl font-black mb-4">{t('Contactez-nous', 'Contact Us')}</h1>
          <p className="animate-page-hero-sub text-xl text-gray-300">{t('Clubs, scouts, parents ou partenaires, écrivez-nous', 'Clubs, scouts, parents or partners, write to us')}</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Form */}
            <Reveal direction="left">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('Envoyez-nous un message', 'Send us a message')}</h2>
                <p className="text-gray-500 text-sm mb-6">
                  {t('Une question ? Remplissez ce formulaire et notre équipe vous répondra rapidement.', 'A question? Fill out this form and our team will get back to you shortly.')}
                </p>

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
                    {t('Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.', 'Your message has been sent successfully. We will respond as soon as possible.')}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
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
                      <option value="tournament">{t('Tournoi / Événement', 'Tournament / Event')}</option>
                      <option value="other">{t('Autre', 'Other')}</option>
                    </select>
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      rows={5}
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
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('Informations', 'Information')}</h2>
                  <p className="text-gray-500 text-sm">
                    {t("Retrouvez l'académie en plein cœur du Congo.", 'Find the academy in the heart of Congo.')}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary/40 hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{t('Adresse', 'Address')}</h3>
                    <p className="text-gray-600 text-sm mt-1">{address}</p>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary/40 hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">Email</h3>
                    <a
                      href={`mailto:${settings.contact_email || 'contact@football-academy.com'}`}
                      className="text-gray-600 text-sm mt-1 block hover:text-primary transition-colors break-all"
                    >
                      {settings.contact_email || 'contact@football-academy.com'}
                    </a>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary/40 hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{t('Téléphone', 'Phone')}</h3>
                    <a
                      href={`tel:${(settings.contact_phone || '').replace(/\s+/g, '')}`}
                      className="text-gray-600 text-sm mt-1 block hover:text-primary transition-colors"
                    >
                      {settings.contact_phone || '+242 XX XXX XX XX'}
                    </a>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary/40 hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{t('Horaires', 'Hours')}</h3>
                    <p className="text-gray-600 text-sm mt-1">{t('Lun – Ven', 'Mon – Fri')} · 8h – 18h</p>
                    <p className="text-gray-600 text-sm">{t('Sam', 'Sat')} · 9h – 14h</p>
                  </div>
                </div>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                  <MapEmbed
                    lat={ACADEMY_LAT}
                    lng={ACADEMY_LNG}
                    zoom={9}
                    popupHtml={popupHtml}
                    className="w-full h-72"
                  />
                  <div className="flex items-center justify-between gap-3 p-4 border-t border-gray-100">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{settings.academy_name || 'Football Academy'}</p>
                      <p className="text-xs text-gray-500 truncate">{address}</p>
                    </div>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      {t('Itinéraire', 'Directions')}
                    </a>
                  </div>
                </div>

                {partners.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">{t('Nos partenaires', 'Our partners')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {partners.map((partner) => (
                        <div key={partner.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
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
