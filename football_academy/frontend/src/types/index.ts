export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  position: string;
  preferred_foot: string;
  height: number | null;
  weight: number | null;
  nationality: string | null;
  category: string;
  goals: number;
  assists: number;
  matches_played: number;
  bio_fr: string | null;
  bio_en: string | null;
  photo: string | null;
  highlight_video: string | null;
  is_featured: boolean;
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  qualification: string | null;
  bio_fr: string | null;
  bio_en: string | null;
  photo: string | null;
}

export interface Partner {
  id: number;
  name: string;
  type: string;
  logo: string | null;
  website: string | null;
  description_fr: string | null;
  description_en: string | null;
}

export interface GalleryItem {
  id: number;
  title_fr: string;
  title_en: string;
  type: 'photo' | 'video';
  category: string;
  file_path: string;
  thumbnail: string | null;
}

export interface Tournament {
  id: number;
  name: string;
  category: string;
  start_date: string;
  end_date: string;
  location: string;
  description_fr: string | null;
  description_en: string | null;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface HomeData {
  featured_players: Player[];
  staff: Staff[];
  partners: Partner[];
  upcoming_tournaments: Tournament[];
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
