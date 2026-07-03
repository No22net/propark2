'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionsAPI, PurchasesAPI } from '@/lib/services';
import { formatPrice, formatDate, getRemainingDays } from '@/lib/utils';
import { Subscription, PurchaseHistory } from '@/types';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState<Subscription | null>(null);
  const [purchases, setPurchases] = useState<PurchaseHistory[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?returnTo=/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([SubscriptionsAPI.mine(), PurchasesAPI.mine()]).then(([s, p]) => {
      if (s.success && s.data) setActive(s.data.active);
      if (p.success && p.data) setPurchases(p.data);
      setLoading(false);
    });
  }, [isAuthenticated]);

  const copyToken = () => {
    if (active?.token) {
      navigator.clipboard.writeText(active.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400" /></div>;
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">خوش آمدید، {user?.name} 👋</h1>
          <p className="text-white/60">{user?.email}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-5"><div className="text-white/60 text-sm mb-1">اشتراک فعال</div><div className="text-2xl font-bold text-purple-400">{active ? 'دارد' : 'ندارد'}</div></GlassCard>
          <GlassCard className="p-5"><div className="text-white/60 text-sm mb-1">روزهای باقی‌مانده</div><div className="text-2xl font-bold text-white">{active ? getRemainingDays(active.endDate) : '-'}</div></GlassCard>
          <GlassCard className="p-5"><div className="text-white/60 text-sm mb-1">تعداد خرید</div><div className="text-2xl font-bold text-white">{purchases.length}</div></GlassCard>
          <GlassCard className="p-5"><div className="text-white/60 text-sm mb-1">نقش</div><div className="text-2xl font-bold text-white">{user?.role === 'ADMIN' ? 'ادمین' : 'کاربر'}</div></GlassCard>
        </div>

        <GlassCard className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">اشتراک فعال</h2>
            {!active && <Link href="/pricing"><Button size="sm">خرید اشتراک</Button></Link>}
          </div>
          {active ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-xl border border-purple-500/20">
                <div>
                  <h3 className="text-white font-semibold text-lg">پلن {active.plan?.name}</h3>
                  <p className="text-white/60 text-sm">{active.plan?.duration} ماهه</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-xl p-3"><div className="text-white/60 text-xs mb-1">شروع</div><div className="text-white text-sm">{formatDate(active.startDate)}</div></div>
                <div className="bg-white/5 rounded-xl p-3"><div className="text-white/60 text-xs mb-1">پایان</div><div className="text-white text-sm">{formatDate(active.endDate)}</div></div>
                <div className="bg-white/5 rounded-xl p-3"><div className="text-white/60 text-xs mb-1">باقی‌مانده</div><div className="text-purple-400 text-sm font-semibold">{getRemainingDays(active.endDate)} روز</div></div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-300 text-sm font-medium">🔑 توکن فعال‌سازی</span>
                  <Button size="sm" variant={copied ? 'primary' : 'secondary'} onClick={copyToken}>{copied ? '✓ کپی شد!' : 'کپی توکن'}</Button>
                </div>
                <div className="bg-black/30 rounded-lg p-3"><code className="text-white text-sm break-all font-mono" dir="ltr">{active.token}</code></div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/60 mb-4">شما هیچ اشتراک فعالی ندارید</p>
              <Link href="/pricing"><Button>مشاهده قیمت‌ها</Button></Link>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">تاریخچه خریدها</h2>
          {purchases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10">
                  <th className="text-right py-3 px-4 text-white/60">تاریخ</th>
                  <th className="text-right py-3 px-4 text-white/60">پلن</th>
                  <th className="text-right py-3 px-4 text-white/60">تناژ</th>
                  <th className="text-right py-3 px-4 text-white/60">مبلغ</th>
                </tr></thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white">{formatDate(p.purchasedAt)}</td>
                      <td className="py-3 px-4 text-white">{p.plan?.name || '-'}</td>
                      <td className="py-3 px-4 text-white">{p.plan?.duration || '-'} ماهه</td>
                      <td className="py-3 px-4 text-purple-400 font-medium">{formatPrice(p.amount)} تومان</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="text-center py-8 text-white/60">تاریخچه خریدی وجود ندارد</div>}
        </GlassCard>
      </div>
    </div>
  );
}
