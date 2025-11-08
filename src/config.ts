// Centralized API base helper — reads Vite env var and provides a small helper
export const API_BASE = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:8080/api/';

/** Build an absolute API URL from a path segment. Ensures single slashes. */
export function api(path: string) {
    const base = API_BASE.replace(/\/$/, '');
    const p = path.replace(/^[\/]*/, '');
    return `${base}/${p}`;
}

/** Simplified POST helper that returns parsed JSON or throws. */
export async function postJSON<T = any>(path: string, body: unknown) {
    const res = await fetch(api(path), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        let errText = res.statusText;
        try { const j = await res.json(); errText = j?.message || JSON.stringify(j); } catch (_) { }
        throw new Error(errText || `HTTP ${res.status}`);
    }
    return (await res.json()) as T;
}
