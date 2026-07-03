// ════════════════════════════════════════════════════════════════
// 🌐 کلاینت API — اتصال به بک‌اند خارجی
// ════════════════════════════════════════════════════════════════
// تمام درخواست‌ها به آدرس NEXT_PUBLIC_API_URL ارسال می‌شوند.
// این فرانت‌اند هیچ بک‌اند داخلی ندارد — فقط به API شما وصل می‌شود.
// توکن JWT در localStorage ذخیره و در هدر Authorization ارسال می‌شود.
// ════════════════════════════════════════════════════════════════

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const TOKEN_KEY = 'proparking_token';

// ─── مدیریت توکن ───
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// ─── نوع پاسخ ───
export interface ApiResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean; // آیا توکن ارسال شود؟
  headers?: Record<string, string>;
}

/**
 * تابع اصلی درخواست به بک‌اند
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResult<T>> {
  const { method = 'GET', body, auth = true, headers = {} } = options;

  try {
    const reqHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (auth) {
      const token = getToken();
      if (token) reqHeaders['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: reqHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    // پاسخ بدون بدنه (مثل 204)
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};

    if (!res.ok) {
      return {
        success: false,
        error: json.error || json.message || `خطای سرور (${res.status})`,
      };
    }

    // بک‌اند ممکن است داده را مستقیم یا داخل { data } برگرداند
    return {
      success: true,
      data: json.data !== undefined ? json.data : json,
      message: json.message,
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      error: e.message || 'خطا در اتصال به سرور',
    };
  }
}

// ─── متدهای کمکی ───
export const api = {
  get: <T = unknown>(url: string, auth = true) => apiFetch<T>(url, { method: 'GET', auth }),
  post: <T = unknown>(url: string, body?: unknown, auth = true) => apiFetch<T>(url, { method: 'POST', body, auth }),
  put: <T = unknown>(url: string, body?: unknown, auth = true) => apiFetch<T>(url, { method: 'PUT', body, auth }),
  patch: <T = unknown>(url: string, body?: unknown, auth = true) => apiFetch<T>(url, { method: 'PATCH', body, auth }),
  delete: <T = unknown>(url: string, auth = true) => apiFetch<T>(url, { method: 'DELETE', auth }),
};
