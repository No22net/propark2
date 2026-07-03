import { api } from './api';
import {
  User, Plan, Subscription, PurchaseHistory, DashboardStats, SiteSettings, ActivityLog,
} from '@/types';

// ════════════════════════════════════════════════════════════════
// 🎯 سرویس‌های API — نقشه کامل endpointهای بک‌اند شما
// ════════════════════════════════════════════════════════════════
// بک‌اند خود را بر اساس این مسیرها پیاده‌سازی کنید.
// همه پاسخ‌ها باید فرمت { success, data, error } داشته باشند
// یا مستقیماً داده را برگردانند.
// ════════════════════════════════════════════════════════════════

// ─── 🔐 احراز هویت ───
export const AuthAPI = {
  // POST /auth/login → { user, token }
  login: (email: string, password: string, captcha?: { token: string; answer: string }) =>
    api.post<{ user: User; token: string }>('/auth/login', { email, password, captcha }, false),

  // POST /auth/register → { user, token }
  register: (data: { name: string; email: string; password: string; captcha?: { token: string; answer: string } }) =>
    api.post<{ user: User; token: string }>('/auth/register', data, false),

  // POST /auth/logout
  logout: () => api.post('/auth/logout'),

  // GET /auth/me → User
  me: () => api.get<User>('/auth/me'),
};

// ─── 👥 کاربران ───
export const UsersAPI = {
  list: () => api.get<User[]>('/users'),
  get: (id: string) => api.get<User>(`/users/${id}`),
  updateRole: (id: string, role: 'USER' | 'ADMIN') => api.patch<User>(`/users/${id}/role`, { role }),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// ─── 💰 پلن‌ها ───
export const PlansAPI = {
  list: () => api.get<Plan[]>('/plans', false), // عمومی
  update: (id: string, price: number, discount?: number) =>
    api.patch<Plan>(`/plans/${id}`, { price, discount }),
};

// ─── 🎫 اشتراک‌ها ───
export const SubscriptionsAPI = {
  listAll: () => api.get<Subscription[]>('/subscriptions'),
  mine: () => api.get<{ active: Subscription | null; all: Subscription[] }>('/subscriptions/me'),
  cancel: (id: string) => api.post(`/subscriptions/${id}/cancel`),
  renew: (id: string, months: number) => api.post<Subscription>(`/subscriptions/${id}/renew`, { months }),
  regenerateToken: (userId: string, adminId?: string, adminName?: string) =>
    api.post<{ token: string }>(`/subscriptions/user/${userId}/token`, { adminId, adminName }),
  // فعال‌سازی سرویس توسط ادمین
  adminActivate: (data: { targetUserId: string; planId: string; adminId: string; adminName: string; note?: string }) =>
    api.post<{ subscription: Subscription; token: string }>('/admin/activate-service', data),
};

// ─── 💳 خریدها ───
export const PurchasesAPI = {
  listAll: () => api.get<PurchaseHistory[]>('/purchases'),
  mine: () => api.get<PurchaseHistory[]>('/purchases/me'),
};

// ─── 💸 پرداخت ───
export const PaymentAPI = {
  // POST /payment/request → { authority, paymentUrl }
  request: (planId: string) => api.post<{ authority: string; paymentUrl: string }>('/payment/request', { planId }),
  // POST /payment/verify → { token, refId, planName, amount }
  verify: (authority: string, planId: string) =>
    api.post<{ token: string; refId: string; planName: string; amount: number }>('/payment/verify', { authority, planId }),
};

// ─── 📊 آمار ───
export const AnalyticsAPI = {
  dashboard: () => api.get<DashboardStats>('/analytics/dashboard'),
  activity: () => api.get<ActivityLog[]>('/analytics/activity'),
  trackPageView: (path: string, visitorId: string) =>
    api.post('/analytics/page-view', { path, visitorId }, false),
};

// ─── ⚙️ تنظیمات ───
export const SettingsAPI = {
  get: () => api.get<SiteSettings>('/settings', false),
  update: (settings: Partial<SiteSettings>) => api.patch<SiteSettings>('/settings', settings),
};

// ─── 🔐 کپچا ───
export const CaptchaAPI = {
  // GET /captcha → { question, token }
  generate: () => api.get<{ question: string; token: string }>('/captcha', false),
};
