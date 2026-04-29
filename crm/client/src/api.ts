const API_BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("crm_token");
}

export function setToken(token: string) {
  localStorage.setItem("crm_token", token);
}

export function clearToken() {
  localStorage.removeItem("crm_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Не авторизован");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Ошибка запроса");
  }

  return res.json();
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ token: string; username: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
    me: () => request<{ id: number; username: string }>("/auth/me"),
  },
  teams: {
    list: () =>
      request<Array<{ id: number; game: string; logo: string; order: number; players: Array<{ id: number; nickname: string; role: string; avatar: string }> }>>("/teams"),
    create: (data: { game: string; logo?: string; order?: number }) =>
      request("/teams", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: { game: string; logo?: string; order?: number }) =>
      request(`/teams/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request(`/teams/${id}`, { method: "DELETE" }),
  },
  players: {
    list: () =>
      request<Array<{ id: number; nickname: string; role: string; avatar: string; teamId: number | null; team: { id: number; game: string } | null }>>("/players"),
    listFree: () =>
      request<Array<{ id: number; nickname: string; role: string; avatar: string }>>("/players/free"),
    create: (data: { nickname: string; role?: string; avatar?: string }) =>
      request("/players", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: { nickname: string; role?: string; avatar?: string }) =>
      request(`/players/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request(`/players/${id}`, { method: "DELETE" }),
    assign: (id: number, teamId: number) =>
      request(`/players/${id}/assign`, { method: "POST", body: JSON.stringify({ teamId }) }),
    unassign: (id: number) =>
      request(`/players/${id}/unassign`, { method: "POST" }),
  },
  games: {
    list: () =>
      request<Array<{ id: number; name: string; url: string; logo: string; visible: boolean; order: number }>>("/games"),
    create: (data: { name: string; url?: string; logo?: string; visible?: boolean; order?: number }) =>
      request("/games", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: { name?: string; url?: string; logo?: string; visible?: boolean; order?: number }) =>
      request(`/games/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request(`/games/${id}`, { method: "DELETE" }),
  },
  gallery: {
    list: () =>
      request<Array<{ id: number; src: string; alt: string; title: string; order: number }>>("/gallery"),
    upload: (file: File, alt: string, title: string, onProgress?: (percent: number, speed: string) => void) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", alt);
      formData.append("title", title);

      return new Promise<{ id: number; src: string; alt: string; title: string; order: number }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const token = getToken();
        const startTime = Date.now();

        xhr.upload.addEventListener("progress", (e) => {
          if (!e.lengthComputable || !onProgress) return;
          const percent = Math.round((e.loaded / e.total) * 100);
          const elapsed = (Date.now() - startTime) / 1000;
          const speedBps = e.loaded / elapsed;
          const speed = speedBps > 1048576
            ? `${(speedBps / 1048576).toFixed(1)} МБ/с`
            : speedBps > 1024
              ? `${(speedBps / 1024).toFixed(1)} КБ/с`
              : `${Math.round(speedBps)} Б/с`;
          onProgress(percent, speed);
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 401) {
            clearToken();
            window.location.href = "/login";
            reject(new Error("Не авторизован"));
            return;
          }
          if (xhr.status < 200 || xhr.status >= 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              reject(new Error(data.error || "Ошибка загрузки"));
            } catch {
              reject(new Error("Ошибка загрузки"));
            }
            return;
          }
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error("Ошибка парсинга ответа"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Сетевая ошибка")));
        xhr.addEventListener("abort", () => reject(new Error("Загрузка отменена")));

        xhr.open("POST", `${API_BASE}/gallery`);
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
      });
    },
    update: (id: number, data: { alt?: string; title?: string; order?: number }) =>
      request(`/gallery/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request(`/gallery/${id}`, { method: "DELETE" }),
  },
  pages: {
    list: () =>
      request<Array<{ id: number; slug: string; title: string; description: string; content: Record<string, unknown> }>>("/pages"),
    get: (slug: string) =>
      request<{ id: number; slug: string; title: string; description: string; content: Record<string, unknown> }>(`/pages/${slug}`),
    update: (slug: string, data: { title: string; description: string; content: Record<string, unknown> }) =>
      request(`/pages/${slug}`, { method: "PUT", body: JSON.stringify(data) }),
  },
  news: {
    list: () =>
      request<Array<{ id: number; title: string; summary: string; content: string; image: string; published: boolean; createdAt: string; updatedAt: string }>>("/news"),
    create: (data: FormData, onProgress?: (percent: number, speed: string) => void) => {
      return new Promise<{ id: number; title: string; summary: string; content: string; image: string; published: boolean; createdAt: string; updatedAt: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const token = getToken();
        const startTime = Date.now();

        xhr.upload.addEventListener("progress", (e) => {
          if (!e.lengthComputable || !onProgress) return;
          const percent = Math.round((e.loaded / e.total) * 100);
          const elapsed = (Date.now() - startTime) / 1000;
          const speedBps = e.loaded / elapsed;
          const speed = speedBps > 1048576
            ? `${(speedBps / 1048576).toFixed(1)} МБ/с`
            : speedBps > 1024
              ? `${(speedBps / 1024).toFixed(1)} КБ/с`
              : `${Math.round(speedBps)} Б/с`;
          onProgress(percent, speed);
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 401) {
            clearToken();
            window.location.href = "/login";
            reject(new Error("Не авторизован"));
            return;
          }
          if (xhr.status < 200 || xhr.status >= 300) {
            try {
              const d = JSON.parse(xhr.responseText);
              reject(new Error(d.error || "Ошибка загрузки"));
            } catch {
              reject(new Error("Ошибка загрузки"));
            }
            return;
          }
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error("Ошибка парсинга ответа"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Сетевая ошибка")));
        xhr.addEventListener("abort", () => reject(new Error("Загрузка отменена")));

        xhr.open("POST", `${API_BASE}/news`);
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(data);
      });
    },
    update: (id: number, data: FormData, onProgress?: (percent: number, speed: string) => void) => {
      return new Promise<{ id: number; title: string; summary: string; content: string; image: string; published: boolean; createdAt: string; updatedAt: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const token = getToken();
        const startTime = Date.now();

        xhr.upload.addEventListener("progress", (e) => {
          if (!e.lengthComputable || !onProgress) return;
          const percent = Math.round((e.loaded / e.total) * 100);
          const elapsed = (Date.now() - startTime) / 1000;
          const speedBps = e.loaded / elapsed;
          const speed = speedBps > 1048576
            ? `${(speedBps / 1048576).toFixed(1)} МБ/с`
            : speedBps > 1024
              ? `${(speedBps / 1024).toFixed(1)} КБ/с`
              : `${Math.round(speedBps)} Б/с`;
          onProgress(percent, speed);
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 401) {
            clearToken();
            window.location.href = "/login";
            reject(new Error("Не авторизован"));
            return;
          }
          if (xhr.status < 200 || xhr.status >= 300) {
            try {
              const d = JSON.parse(xhr.responseText);
              reject(new Error(d.error || "Ошибка сохранения"));
            } catch {
              reject(new Error("Ошибка сохранения"));
            }
            return;
          }
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error("Ошибка парсинга ответа"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Сетевая ошибка")));
        xhr.addEventListener("abort", () => reject(new Error("Загрузка отменена")));

        xhr.open("PUT", `${API_BASE}/news/${id}`);
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(data);
      });
    },
    delete: (id: number) =>
      request(`/news/${id}`, { method: "DELETE" }),
  },
};
