'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import {
  AnalyticsAPI, UsersAPI, PlansAPI, SubscriptionsAPI, PurchasesAPI, SettingsAPI,
} from '@/lib/services';
import { getDiscountedPrice as getDiscount } from '@/types';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';

type Tab = 'overview' | 'users' | 'subscriptions' | 'purchases' | 'prices' | 'tokens' | 'activity' | 'settings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDiscountedPrice(price: number, discount: number): number {
  return getDiscount({ price, discount } as any);
}

export default function AdminPage() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);

  const fetchStats = useCallback(async () => {
    const res = await AnalyticsAPI.dashboard();
    if (res.success) setStats(res.data);
  }, []);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) router.push('/');
    if (isAuthenticated && isAdmin) fetchStats();
  }, [loading, isAuthenticated, isAdmin, router, fetchStats]);

  if (loading || !stats) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400" /></div>;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: '📊 داشبورد' },
    { key: 'users', label: '👥 کاربران' },
    { key: 'subscriptions', label: '🎫 اشتراک‌ها' },
    { key: 'purchases', label: '💳 تراکنش‌ها' },
    { key: 'prices', label: '💰 قیمت‌ها' },
    { key: 'tokens', label: '🔑 توکن‌ها' },
    { key: 'activity', label: '📝 لاگ‌ها' },
    { key: 'settings', label: '⚙️ تنظیمات' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">پنل مدیریت</h1>
          <p className="text-white/60 text-sm">خوش آمدید، {user?.name}</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${tab === t.key ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && <Overview stats={stats} />}
        {tab === 'users' && <Users onChange={fetchStats} />}
        {tab === 'subscriptions' && <Subscriptions onChange={fetchStats} />}
        {tab === 'purchases' && <Purchases />}
        {tab === 'prices' && <Prices />}
        {tab === 'tokens' && <Tokens />}
        {tab === 'activity' && <Activity />}
        {tab === 'settings' && <Settings />}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Overview({ stats }: { stats: any }) {
  const cards = [
    { label: 'کل درآمد', value: `${formatPrice(stats.totalRevenue)} ت`, color: 'text-purple-400' },
    { label: 'کاربران', value: formatPrice(stats.totalUsers), color: 'text-blue-400' },
    { label: 'کل بازدید', value: formatPrice(stats.totalPageViews), color: 'text-green-400' },
    { label: 'اشتراک فعال', value: formatPrice(stats.activeSubscriptions), color: 'text-pink-400' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <GlassCard key={i} className="p-5"><div className="text-white/60 text-sm mb-1">{c.label}</div><div className={`text-2xl font-bold ${c.color}`}>{c.value}</div></GlassCard>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4"><div className="text-white/60 text-xs mb-1">درآمد امروز</div><div className="text-lg font-bold text-white">{formatPrice(stats.revenueToday)} ت</div></GlassCard>
        <GlassCard className="p-4"><div className="text-white/60 text-xs mb-1">درآمد هفته</div><div className="text-lg font-bold text-white">{formatPrice(stats.revenueThisWeek)} ت</div></GlassCard>
        <GlassCard className="p-4"><div className="text-white/60 text-xs mb-1">بازدید امروز</div><div className="text-lg font-bold text-white">{formatPrice(stats.pageViewsToday)}</div></GlassCard>
        <GlassCard className="p-4"><div className="text-white/60 text-xs mb-1">نرخ تبدیل</div><div className="text-lg font-bold text-white">{stats.conversionRate.toFixed(2)}%</div></GlassCard>
      </div>
      <GlassCard className="p-6">
        <h3 className="text-white font-semibold mb-4">فعالیت‌های اخیر</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {stats.recentActivity?.map((a: any) => (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 text-sm">
              <div className="flex-1"><div className="text-white">{a.description}</div><div className="text-white/40 text-xs mt-0.5">{formatDateTime(a.timestamp)}</div></div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function Users({ onChange }: { onChange: () => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const load = useCallback(() => { UsersAPI.list().then((r) => { if (r.success) setUsers(r.data as never[]); }); }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = users.filter((u) => u.name.includes(search) || u.email.includes(search));

  const changeRole = async (id: string, role: string) => {
    if (!confirm('تغییر نقش؟')) return;
    await UsersAPI.updateRole(id, role === 'ADMIN' ? 'USER' : 'ADMIN');
    load(); onChange();
  };
  const del = async (id: string) => {
    if (!confirm('حذف کاربر؟')) return;
    await UsersAPI.delete(id); load(); onChange();
  };

  return (
    <GlassCard className="p-6">
      <Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/10 text-right">
            <th className="py-3 px-4 text-white/60">نام</th><th className="py-3 px-4 text-white/60">ایمیل</th>
            <th className="py-3 px-4 text-white/60">نقش</th><th className="py-3 px-4 text-white/60">عملیات</th>
          </tr></thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-white">{u.name}</td>
                <td className="py-3 px-4 text-white/80">{u.email}</td>
                <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs ${u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>{u.role === 'ADMIN' ? 'ادمین' : 'کاربر'}</span></td>
                <td className="py-3 px-4"><div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => changeRole(u.id, u.role)}>{u.role === 'ADMIN' ? 'تنزل' : 'ارتقا'}</Button>
                  <Button size="sm" variant="danger" onClick={() => del(u.id)}>حذف</Button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function Subscriptions({ onChange }: { onChange: () => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subs, setSubs] = useState<any[]>([]);
  const load = useCallback(() => { SubscriptionsAPI.listAll().then((r) => { if (r.success) setSubs(r.data as never[]); }); }, []);
  useEffect(() => { load(); }, [load]);

  const cancel = async (id: string) => { if (confirm('لغو اشتراک؟')) { await SubscriptionsAPI.cancel(id); load(); onChange(); } };
  const renew = async (id: string) => { const m = parseInt(prompt('تعداد ماه:', '1') || '0'); if (m > 0) { await SubscriptionsAPI.renew(id, m); load(); onChange(); } };

  return (
    <GlassCard className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/10 text-right">
            <th className="py-3 px-4 text-white/60">کاربر</th><th className="py-3 px-4 text-white/60">پلن</th>
            <th className="py-3 px-4 text-white/60">پایان</th><th className="py-3 px-4 text-white/60">وضعیت</th><th className="py-3 px-4 text-white/60">عملیات</th>
          </tr></thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4"><div className="text-white text-sm">{s.user?.name}</div><div className="text-white/50 text-xs">{s.user?.email}</div></td>
                <td className="py-3 px-4 text-white">{s.plan?.name} {s.plan?.duration}m</td>
                <td className="py-3 px-4 text-white/60">{formatDate(s.endDate)}</td>
                <td className="py-3 px-4"><span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/70">{s.status}</span></td>
                <td className="py-3 px-4"><div className="flex gap-2">
                  {s.status === 'active' && <Button size="sm" variant="danger" onClick={() => cancel(s.id)}>لغو</Button>}
                  <Button size="sm" variant="secondary" onClick={() => renew(s.id)}>تمدید</Button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function Purchases() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { PurchasesAPI.listAll().then((r) => { if (r.success) setItems(r.data as never[]); }); }, []);
  const total = items.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <GlassCard className="p-4"><div className="text-white/60 text-xs mb-1">جمع کل</div><div className="text-xl font-bold text-purple-400">{formatPrice(total)} ت</div></GlassCard>
        <GlassCard className="p-4"><div className="text-white/60 text-xs mb-1">تعداد</div><div className="text-xl font-bold text-white">{items.length}</div></GlassCard>
        <GlassCard className="p-4"><div className="text-white/60 text-xs mb-1">میانگین</div><div className="text-xl font-bold text-white">{items.length ? formatPrice(Math.round(total / items.length)) : 0} ت</div></GlassCard>
      </div>
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10 text-right">
              <th className="py-3 px-4 text-white/60">تاریخ</th><th className="py-3 px-4 text-white/60">کاربر</th>
              <th className="py-3 px-4 text-white/60">پلن</th><th className="py-3 px-4 text-white/60">مبلغ</th>
            </tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-white/80">{formatDateTime(p.purchasedAt)}</td>
                  <td className="py-3 px-4 text-white">{p.user?.name}</td>
                  <td className="py-3 px-4 text-white">{p.plan?.name} {p.plan?.duration}m</td>
                  <td className="py-3 px-4 text-purple-400 font-bold">{formatPrice(p.amount)} ت</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function Prices() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plans, setPlans] = useState<any[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [discounts, setDiscounts] = useState<Record<string, number>>({});
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    PlansAPI.list().then((r) => {
      if (r.success && r.data) {
        const data = r.data as never[];
        setPlans(data);
        const p: Record<string, number> = {}, d: Record<string, number> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.forEach((pl: any) => { p[pl.id] = pl.price; d[pl.id] = pl.discount; });
        setPrices(p); setDiscounts(d);
      }
    });
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    for (const pl of plans) {
      if (prices[pl.id] !== pl.price || discounts[pl.id] !== pl.discount) {
        await PlansAPI.update(pl.id, prices[pl.id], discounts[pl.id]);
      }
    }
    load(); setMsg('✅ ذخیره شد'); setTimeout(() => setMsg(''), 3000);
  };

  const label = (m: number) => ({ 1: '۱ ماهه', 3: '۳ ماهه', 6: '۶ ماهه', 12: '۱ ساله' } as Record<number, string>)[m];

  return (
    <div className="space-y-6">
      {msg && <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">{msg}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(['Pro', 'Eco'] as const).map((type) => (
          <GlassCard key={type} className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">پلن {type}</h3>
            <div className="space-y-4">
              {plans.filter((p) => p.name === type).map((p) => (
                <div key={p.id} className="bg-white/5 rounded-xl p-4 space-y-3">
                  <div className="text-white text-sm font-medium">{label(p.duration)}</div>
                  <div>
                    <label className="text-white/50 text-xs mb-1 block">قیمت اصلی (تومان)</label>
                    <input type="text" value={formatPrice(prices[p.id] || 0)} onChange={(e) => setPrices((prev) => ({ ...prev, [p.id]: parseInt(e.target.value.replace(/[^\d]/g, '')) || 0 }))} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs mb-1 block">درصد تخفیف (%)</label>
                    <input type="number" min="0" max="100" value={discounts[p.id] || 0} onChange={(e) => setDiscounts((prev) => ({ ...prev, [p.id]: Math.min(100, parseInt(e.target.value) || 0) }))} className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-white/70 text-xs">قیمت نهایی:</span>
                    <span className="text-purple-300 font-bold">{formatPrice(getDiscountedPrice(prices[p.id] || 0, discounts[p.id] || 0))} ت</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
      <div className="flex justify-end"><Button onClick={save}>ذخیره همه تغییرات</Button></div>
    </div>
  );
}

function Tokens() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [created, setCreated] = useState<{ name: string; token: string } | null>(null);
  const [search, setSearch] = useState('');
  useEffect(() => { UsersAPI.list().then((r) => { if (r.success) setUsers(r.data as never[]); }); }, []);

  const gen = async (id: string, name: string) => {
    const r = await SubscriptionsAPI.regenerateToken(id);
    if (r.success && r.data) setCreated({ name, token: (r.data as { token: string }).token });
    else alert(r.error);
  };

  const filtered = users.filter((u) => u.role === 'USER' && (u.name.includes(search) || u.email.includes(search)));

  return (
    <div className="space-y-6">
      {created && (
        <GlassCard className="p-6 ring-1 ring-purple-500/20">
          <h3 className="text-purple-300 font-semibold mb-2">توکن جدید برای {created.name}</h3>
          <div className="bg-black/30 rounded-lg p-3"><code className="text-white text-sm break-all font-mono" dir="ltr">{created.token}</code></div>
        </GlassCard>
      )}
      <GlassCard className="p-6">
        <Input placeholder="جستجوی کاربر..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div><div className="text-white text-sm">{u.name}</div><div className="text-white/50 text-xs">{u.email}</div></div>
              <Button size="sm" onClick={() => gen(u.id, u.name)}>توکن جدید</Button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function Activity() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => { AnalyticsAPI.activity().then((r) => { if (r.success) setLogs(r.data as never[]); }); }, []);

  return (
    <GlassCard className="p-6">
      <h3 className="text-white font-semibold mb-4">لاگ فعالیت‌ها ({logs.length})</h3>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {logs.map((l) => (
          <div key={l.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl text-sm">
            <div className="flex-1"><div className="text-white">{l.description}</div><div className="text-white/40 text-xs mt-1">{formatDateTime(l.timestamp)}</div></div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function Settings() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<any>(null);
  const [msg, setMsg] = useState('');
  useEffect(() => { SettingsAPI.get().then((r) => { if (r.success) setSettings(r.data); }); }, []);

  const save = async () => {
    await SettingsAPI.update(settings);
    setMsg('✅ ذخیره شد'); setTimeout(() => setMsg(''), 3000);
  };

  if (!settings) return <div className="text-center py-12 text-white/40">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      {msg && <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">{msg}</div>}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-white font-semibold">اطلاعات سایت</h3>
        <Input label="نام سایت" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
        <Input label="عنوان هیرو" value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} />
        <Input label="ایمیل تماس" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} />
        <Input label="تلفن" value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} />
      </GlassCard>
      <div className="flex justify-end"><Button onClick={save}>ذخیره تنظیمات</Button></div>
    </div>
  );
}
