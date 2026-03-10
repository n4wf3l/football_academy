import api from './client';
import type { HomeData, Player, Staff, Partner, GalleryItem, Tournament, ContactForm, AuthResponse, LoginForm, RegisterForm, User, SiteSettings, TrainingSession, Category } from '../types';

export const fetchHome = () => api.get<HomeData>('/home').then((r) => r.data);

export const fetchPlayers = () => api.get<Player[]>('/players').then((r) => r.data);

export const fetchPlayer = (id: number) => api.get<Player>(`/players/${id}`).then((r) => r.data);

export const fetchStaff = () => api.get<Staff[]>('/staff').then((r) => r.data);

export const fetchPartners = () => api.get<Partner[]>('/partners').then((r) => r.data);

export const fetchGallery = () => api.get<GalleryItem[]>('/gallery').then((r) => r.data);

export const fetchTournaments = () => api.get<Tournament[]>('/tournaments').then((r) => r.data);

export const sendContact = (data: ContactForm) => api.post('/contact', data).then((r) => r.data);

// Auth
export const login = (data: LoginForm) => api.post<AuthResponse>('/login', data).then((r) => r.data);

export const register = (data: RegisterForm) => api.post<AuthResponse>('/register', data).then((r) => r.data);

export const logout = () => api.post('/logout').then((r) => r.data);

export const fetchUser = () => api.get<User>('/user').then((r) => r.data);

// Settings
export const fetchSettings = () => api.get<SiteSettings>('/settings/public').then((r) => r.data);
export const updateSettings = (data: Partial<SiteSettings>) => api.put<SiteSettings>('/settings', data).then((r) => r.data);

// Upload
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<{ url: string; path: string }>('/upload', formData).then((r) => r.data);
};

// Player CRUD
export const createPlayer = (data: Partial<Player>) => api.post<Player>('/players', data).then((r) => r.data);
export const updatePlayer = (id: number, data: Partial<Player>) => api.put<Player>(`/players/${id}`, data).then((r) => r.data);
export const deletePlayer = (id: number) => api.delete(`/players/${id}`);

// Training sessions
export const fetchTrainingSessions = () => api.get<TrainingSession[]>('/training-sessions').then((r) => r.data);
export const createTrainingSession = (data: Partial<TrainingSession>) => api.post<TrainingSession>('/training-sessions', data).then((r) => r.data);
export const updateTrainingSession = (id: number, data: Partial<TrainingSession>) => api.put<TrainingSession>(`/training-sessions/${id}`, data).then((r) => r.data);
export const deleteTrainingSession = (id: number) => api.delete(`/training-sessions/${id}`);
export const reorderTrainingSessions = (sessions: { id: number; day_of_week: number; sort_order: number }[]) => api.post('/training-sessions/reorder', { sessions });

// Partner CRUD
export const createPartner = (data: Partial<Partner>) => api.post<Partner>('/partners', data).then((r) => r.data);
export const updatePartner = (id: number, data: Partial<Partner>) => api.put<Partner>(`/partners/${id}`, data).then((r) => r.data);
export const deletePartner = (id: number) => api.delete(`/partners/${id}`);

// Gallery CRUD
export const createGalleryItem = (data: Partial<GalleryItem>) => api.post<GalleryItem>('/gallery', data).then((r) => r.data);
export const updateGalleryItem = (id: number, data: Partial<GalleryItem>) => api.put<GalleryItem>(`/gallery/${id}`, data).then((r) => r.data);
export const deleteGalleryItem = (id: number) => api.delete(`/gallery/${id}`);

// Tournament CRUD
export const createTournament = (data: Partial<Tournament>) => api.post<Tournament>('/tournaments', data).then((r) => r.data);
export const updateTournament = (id: number, data: Partial<Tournament>) => api.put<Tournament>(`/tournaments/${id}`, data).then((r) => r.data);
export const deleteTournament = (id: number) => api.delete(`/tournaments/${id}`);

// Category CRUD
export const fetchCategories = () => api.get<Category[]>('/categories').then((r) => r.data);
export const fetchActiveCategories = () => api.get<Category[]>('/categories/active').then((r) => r.data);
export const createCategory = (data: Partial<Category>) => api.post<Category>('/categories', data).then((r) => r.data);
export const updateCategory = (id: number, data: Partial<Category>) => api.put<Category>(`/categories/${id}`, data).then((r) => r.data);
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);
export const toggleCategory = (id: number) => api.patch<Category>(`/categories/${id}/toggle`).then((r) => r.data);

// Staff CRUD
export const createStaff = (data: Partial<Staff>) => api.post<Staff>('/staff', data).then((r) => r.data);
export const updateStaff = (id: number, data: Partial<Staff>) => api.put<Staff>(`/staff/${id}`, data).then((r) => r.data);
export const deleteStaff = (id: number) => api.delete(`/staff/${id}`);
