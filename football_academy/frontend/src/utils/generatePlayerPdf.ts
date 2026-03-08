import jsPDF from 'jspdf';
import type { Player, SiteSettings } from '../types';

type Lang = 'fr' | 'en';

function t(lang: Lang, fr: string, en: string) {
  return lang === 'en' ? en : fr;
}

export function generatePlayerPdf(player: Player, settings: SiteSettings, lang: Lang) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 0;

  const primary = settings.primary_color || '#1B5E20';
  const age = new Date().getFullYear() - new Date(player.date_of_birth).getFullYear();

  // ===== PAGE 1: PLAYER PROFILE =====

  // Dark header background
  doc.setFillColor('#1a1a2e');
  doc.rect(0, 0, pageW, 80, 'F');

  // Accent bar
  doc.setFillColor(primary);
  doc.rect(0, 80, pageW, 4, 'F');

  // Academy name
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(settings.academy_name, pageW / 2, 15, { align: 'center' });

  // Player name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(`${player.first_name} ${player.last_name}`, pageW / 2, 40, { align: 'center' });

  // Position badge
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(player.position, pageW / 2, 55, { align: 'center' });

  // Category & nationality
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(10);
  doc.text(`${player.category} | ${player.nationality || '-'}`, pageW / 2, 68, { align: 'center' });

  // ===== PERSONAL INFO TABLE =====
  y = 95;

  const sectionHeader = (title: string) => {
    doc.setFillColor(primary);
    doc.rect(margin, y, 4, 10, 'F');
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 10, y + 8);
    y += 16;
  };

  sectionHeader(t(lang, 'Informations Personnelles', 'Personal Information'));

  // Info grid - 2 columns
  const infoItems = [
    { label: t(lang, 'Age', 'Age'), value: `${age} ${t(lang, 'ans', 'years')}` },
    { label: t(lang, 'Date de naissance', 'Date of Birth'), value: new Date(player.date_of_birth).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR') },
    { label: t(lang, 'Taille', 'Height'), value: player.height ? `${player.height} cm` : '-' },
    { label: t(lang, 'Poids', 'Weight'), value: player.weight ? `${player.weight} kg` : '-' },
    { label: t(lang, 'Pied fort', 'Strong Foot'), value: player.preferred_foot === 'right' ? t(lang, 'Droit', 'Right') : t(lang, 'Gauche', 'Left') },
    { label: t(lang, 'Nationalite', 'Nationality'), value: player.nationality || '-' },
  ];

  const colW = contentW / 2;
  infoItems.forEach((item, i) => {
    const col = i % 2;
    const x = margin + col * colW;
    if (col === 0 && i > 0) y += 12;

    doc.setTextColor(120, 120, 120);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(item.label, x, y);

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(item.value, x, y + 5);
  });

  y += 20;

  // ===== STATISTICS =====
  if (player.matches_played > 0) {
    sectionHeader(t(lang, 'Statistiques', 'Statistics'));

    const stats = [
      { label: t(lang, 'Matchs joues', 'Matches Played'), value: String(player.matches_played) },
      { label: t(lang, 'Buts', 'Goals'), value: String(player.goals) },
      { label: t(lang, 'Passes decisives', 'Assists'), value: String(player.assists) },
    ];

    const statW = contentW / 3;
    stats.forEach((stat, i) => {
      const x = margin + i * statW + statW / 2;

      // Stat box
      doc.setFillColor('#f3f4f6');
      doc.roundedRect(margin + i * statW, y, statW - 4, 25, 3, 3, 'F');

      doc.setTextColor(primary);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(stat.value, x, y + 12, { align: 'center' });

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(stat.label, x, y + 20, { align: 'center' });
    });

    y += 35;
  }

  // ===== BIOGRAPHY =====
  const bio = lang === 'en' ? player.bio_en : player.bio_fr;
  if (bio) {
    sectionHeader(t(lang, 'Biographie', 'Biography'));

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(bio, contentW);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 10;
  }

  // ===== FOOTER =====
  const footerY = 275;
  doc.setDrawColor(primary);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageW - margin, footerY);

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(settings.academy_name, margin, footerY + 6);
  doc.text(new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR'), pageW - margin, footerY + 6, { align: 'right' });

  if (settings.contact_email) {
    doc.text(settings.contact_email, margin, footerY + 11);
  }
  if (settings.contact_phone) {
    doc.text(settings.contact_phone, pageW - margin, footerY + 11, { align: 'right' });
  }

  // Save
  const filename = `${player.first_name}_${player.last_name}_${t(lang, 'Profil', 'Profile')}_${lang.toUpperCase()}.pdf`;
  doc.save(filename);
}
