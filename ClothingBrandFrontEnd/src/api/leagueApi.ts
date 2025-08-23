import { api } from './axios';
import type { CreateLeagueRequest, League } from '../types/seller';

export async function createLeague(payload: CreateLeagueRequest): Promise<League> {
  const { data } = await api.post<League>('/api/seller/leagues', payload);
  return data;
}

export async function listLeagues(): Promise<League[]> {
  const { data } = await api.get<League[]>('/api/seller/leagues');
  return data;
}

export async function updateLeagueBadges(
  leagueId: number,
  badges: { badgeName: string }[]
): Promise<League> {
  const { data } = await api.put<League>(`/api/seller/leagues/${leagueId}/badges`, badges);
  return data;
}

export async function deleteLeague(id: number): Promise<void> {
  await api.delete(`/api/seller/leagues/${id}`);
}
