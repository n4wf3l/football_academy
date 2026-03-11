import jsPDF from 'jspdf';
import type { SiteSettings, Staff, Partner } from '../types';

type Lang = 'fr' | 'en';

function t(lang: Lang, fr: string, en: string) {
  return lang === 'en' ? en : fr;
}

export function generateCenterPdf(
  settings: SiteSettings,
  staff: Staff[],
  partners: Partner[],
  lang: Lang,
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 0;

  const primary = settings.primary_color || '#1B5E20';

  // Helper: draw colored rect
  const drawRect = (yPos: number, h: number, color: string) => {
    doc.setFillColor(color);
    doc.rect(0, yPos, pageW, h, 'F');
  };

  // Helper: add new page if needed
  const checkPage = (needed: number) => {
    if (y + needed > 280) {
      doc.addPage();
      y = 20;
    }
  };

  // ===== PAGE 1: COVER =====
  drawRect(0, 297, '#1a1a2e');
  drawRect(100, 8, primary);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.academy_name, pageW / 2, 60, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(
    t(lang, "Centre de Formation de Football d'Excellence", 'Football Training Center of Excellence'),
    pageW / 2,
    80,
    { align: 'center' },
  );

  doc.setFontSize(11);
  doc.setTextColor(180, 180, 180);

  if (settings.contact_address) {
    doc.text(settings.contact_address, pageW / 2, 130, { align: 'center' });
  }
  if (settings.contact_email) {
    doc.text(settings.contact_email, pageW / 2, 140, { align: 'center' });
  }
  if (settings.contact_phone) {
    doc.text(settings.contact_phone, pageW / 2, 150, { align: 'center' });
  }

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(
    t(lang, 'Dossier de presentation officiel', 'Official Presentation Document'),
    pageW / 2,
    250,
    { align: 'center' },
  );
  doc.text(new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR'), pageW / 2, 258, { align: 'center' });

  // ===== PAGE 2: VISION & OBJECTIVES =====
  doc.addPage();
  y = 20;

  // Section header helper
  const sectionHeader = (title: string) => {
    checkPage(20);
    doc.setFillColor(primary);
    doc.rect(margin, y, 4, 10, 'F');
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 10, y + 8);
    y += 18;
  };

  const paragraph = (text: string) => {
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentW);
    checkPage(lines.length * 5 + 5);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 5;
  };

  const bulletPoint = (text: string) => {
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentW - 8);
    checkPage(lines.length * 5 + 3);
    doc.setFillColor(primary);
    doc.circle(margin + 2, y - 1, 1.5, 'F');
    doc.text(lines, margin + 8, y);
    y += lines.length * 5 + 3;
  };

  sectionHeader(t(lang, 'Notre Vision', 'Our Vision'));
  paragraph(t(lang,
    "Devenir un centre de reference en Afrique pour la formation de jeunes footballeurs capables d'integrer les meilleurs clubs europeens et africains. Nous croyons que chaque jeune talent merite une chance de realiser son reve, avec un accompagnement professionnel complet.",
    'To become a reference center in Africa for training young footballers capable of joining the best European and African clubs. We believe every young talent deserves a chance to achieve their dream, with comprehensive professional support.',
  ));

  sectionHeader(t(lang, 'Nos Objectifs', 'Our Goals'));
  const objectives = lang === 'en' ? [
    'Train technically and tactically competent players',
    'Ensure quality academic and educational support',
    'Develop physical and mental qualities',
    'Place players in professional clubs',
    'Develop responsible and disciplined individuals',
  ] : [
    'Former des joueurs techniquement et tactiquement compétents',
    'Assurer un suivi scolaire et éducatif de qualité',
    'Développer les qualités physiques et mentales',
    'Placer les joueurs dans des clubs professionnels',
    'Former des hommes responsables et disciplinés',
  ];
  objectives.forEach((obj) => bulletPoint(obj));

  // ===== METHODOLOGY =====
  y += 5;
  sectionHeader(t(lang, "Methodologie d'Entrainement", 'Training Methodology'));
  const methods = lang === 'en' ? [
    'Technical: Ball mastery, dribbling, passing, shooting',
    'Tactical: Game understanding, positioning, transitions',
    'Physical: Endurance, speed, strength, coordination',
    'Mental: Focus, confidence, teamwork',
  ] : [
    'Technique : Maitrise du ballon, dribble, passes, frappes',
    'Tactique : Comprehension du jeu, placement, transitions',
    'Physique : Endurance, vitesse, force, coordination',
    'Mental : Concentration, confiance, esprit d\'equipe',
  ];
  methods.forEach((m) => bulletPoint(m));

  // ===== INFRASTRUCTURE =====
  y += 5;
  sectionHeader(t(lang, 'Nos Infrastructures', 'Our Facilities'));
  const infra = lang === 'en' ? [
    'Training Fields - Natural and synthetic grass fields for daily sessions',
    'Boarding House - Rooms, dining hall and study room for player accommodation',
    'Gym - Modern equipment for physical training and rehabilitation',
    'Study Room - Dedicated space for academic support and player education',
    'Changing Rooms - Equipped with showers for player comfort',
    'Medical Office - Regular medical monitoring and injury management',
  ] : [
    "Terrains d'entrainement - Terrains en gazon naturel et synthetique",
    "Internat - Chambres, refectoire et salle d'etude",
    'Salle de musculation - Equipement moderne pour la preparation physique',
    "Salle d'etude - Espace dedie au suivi scolaire",
    'Vestiaires - Equipes avec douches',
    'Bureau medical - Suivi medical regulier',
  ];
  infra.forEach((i) => bulletPoint(i));

  // ===== SPORTS PROGRAM =====
  doc.addPage();
  y = 20;
  sectionHeader(t(lang, 'Programme Sportif', 'Sports Program'));
  paragraph(t(lang,
    "5 entraînements par semaine avec des entraîneurs diplômés. Travail technique, tactique et préparation physique. Suivi scolaire obligatoire. Participation à des championnats, tournois nationaux et internationaux.",
    '5 training sessions per week with certified coaches. Technical, tactical and physical preparation. Mandatory academic support. Participation in championships, national and international tournaments.',
  ));

  // Age categories
  y += 5;
  sectionHeader(t(lang, "Categories d'Age", 'Age Categories'));
  const categories = lang === 'en' ? [
    'U13 (11-12 years) - Fun, individual technique, small-sided games',
    'U15 (13-14 years) - Technical and tactical development, physical initiation',
    'U17 (15-16 years) - Tactical improvement, physical conditioning, competition',
    'U19 (17-18 years) - Pre-professionalization, performance, club placement',
  ] : [
    'U13 (11-12 ans) - Plaisir, technique individuelle, jeu reduit',
    'U15 (13-14 ans) - Developpement technique et tactique, initiation physique',
    'U17 (15-16 ans) - Perfectionnement tactique, preparation physique, competition',
    'U19 (17-18 ans) - Pre-professionnalisation, performance, placement en clubs',
  ];
  categories.forEach((c) => bulletPoint(c));

  // ===== COACHING STAFF =====
  if (staff.length > 0) {
    y += 5;
    sectionHeader(t(lang, 'Notre Encadrement', 'Our Coaching Staff'));
    staff.forEach((member) => {
      checkPage(15);
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(member.name, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(` - ${member.role}${member.qualification ? ` (${member.qualification})` : ''}`, margin + doc.getTextWidth(member.name), y);
      y += 7;
    });
  }

  // ===== PARTNERS =====
  if (partners.length > 0) {
    y += 5;
    sectionHeader(t(lang, 'Nos Partenaires', 'Our Partners'));
    partners.forEach((partner) => {
      checkPage(10);
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${partner.name} (${partner.type})`, margin, y);
      y += 6;
    });
  }

  // ===== CONTACT INFO (last page footer) =====
  y += 15;
  checkPage(30);
  doc.setDrawColor(primary);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(t(lang, 'Contactez-nous', 'Contact Us'), margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  if (settings.contact_address) { doc.text(settings.contact_address, margin, y); y += 6; }
  if (settings.contact_email) { doc.text(settings.contact_email, margin, y); y += 6; }
  if (settings.contact_phone) { doc.text(settings.contact_phone, margin, y); y += 6; }

  // Social links
  const socials = [
    { key: 'social_facebook', label: 'Facebook' },
    { key: 'social_instagram', label: 'Instagram' },
    { key: 'social_youtube', label: 'YouTube' },
    { key: 'social_linkedin', label: 'LinkedIn' },
  ].filter((s) => settings[s.key as keyof SiteSettings]);

  if (socials.length > 0) {
    y += 3;
    socials.forEach((s) => {
      doc.text(`${s.label}: ${settings[s.key as keyof SiteSettings]}`, margin, y);
      y += 5;
    });
  }

  // Save
  const filename = `${settings.academy_name.replace(/\s+/g, '_')}_${t(lang, 'Dossier', 'Presentation')}_${lang.toUpperCase()}.pdf`;
  doc.save(filename);
}
