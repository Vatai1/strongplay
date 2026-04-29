const CRM_API = process.env.CRM_API_URL || "http://localhost:3001";

interface ApiTeam {
  id: number;
  game: string;
  logo: string;
  order: number;
  players: Array<{ id: number; nickname: string; role: string; avatar: string }>;
}

interface ApiGalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  order: number;
}

interface ApiPageMeta {
  slug: string;
  title: string;
  description: string;
  content: Record<string, unknown>;
}

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${CRM_API}/api${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getTeams(): Promise<ApiTeam[]> {
  try {
    return await fetchApi<ApiTeam[]>("/teams");
  } catch {
    return [];
  }
}

export async function getGallery(): Promise<ApiGalleryImage[]> {
  try {
    return await fetchApi<ApiGalleryImage[]>("/gallery");
  } catch {
    return [];
  }
}

export async function getPageMeta(slug: string): Promise<ApiPageMeta | null> {
  try {
    return await fetchApi<ApiPageMeta>(`/pages/${slug}`);
  } catch {
    return null;
  }
}

export type { ApiTeam, ApiGalleryImage, ApiPageMeta };
