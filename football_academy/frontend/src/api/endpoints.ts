import api from './client';
import type { HomeData, Player, Staff, Partner, GalleryItem, Tournament, ContactForm } from '../types';

export const fetchHome = () => api.get<HomeData>('/home').then((r) => r.data);

export const fetchPlayers = () => api.get<Player[]>('/players').then((r) => r.data);

export const fetchPlayer = (id: number) => api.get<Player>(`/players/${id}`).then((r) => r.data);

export const fetchStaff = () => api.get<Staff[]>('/staff').then((r) => r.data);

export const fetchPartners = () => api.get<Partner[]>('/partners').then((r) => r.data);

export const fetchGallery = () => api.get<GalleryItem[]>('/gallery').then((r) => r.data);

export const fetchTournaments = () => api.get<Tournament[]>('/tournaments').then((r) => r.data);

export const sendContact = (data: ContactForm) => api.post('/contact', data).then((r) => r.data);
