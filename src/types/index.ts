// ════════════════════════════════════════════════════════════════
// 📦 تایپ‌های مشترک (مطابق با پاسخ‌های بک‌اند شما)
// ════════════════════════════════════════════════════════════════

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Plan {
  id: string;
  name: 'Pro' | 'Eco';
  duration: 1 | 3 | 6 | 12;
  price: number;
  discount: number;
}

export function getDiscountedPrice(plan: Plan): number {
  if (!plan.discount || plan.discount <= 0) return plan.price;
  return Math.round(plan.price * (1 - plan.discount / 100));
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  token: string;
  status: 'active' | 'expired' | 'cancelled';
  plan?: Plan;
  user?: User;
}

export interface PurchaseHistory {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  purchasedAt: string;
  plan?: Plan;
  user?: User;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  type: 'login' | 'logout' | 'register' | 'purchase' | 'admin_action' | 'subscription_created' | 'subscription_cancelled' | 'token_generated' | 'price_updated';
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  cancelledSubscriptions: number;
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  totalPurchases: number;
  totalPageViews: number;
  pageViewsToday: number;
  pageViewsThisWeek: number;
  uniqueVisitorsToday: number;
  conversionRate: number;
  topPlans: { planId: string; planName: string; count: number; revenue: number }[];
  recentActivity: ActivityLog[];
  revenueByDay: { date: string; revenue: number }[];
  visitsByDay: { date: string; visits: number }[];
  registrationsByDay: { date: string; count: number }[];
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  heroTitle: string;
  heroSubtitle: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
}
