'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { PlansAPI, PaymentAPI } from '@/lib/services';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Plan, getDiscountedPrice } from '@/types';

function discounted(plan: Plan) {
  return getDiscountedPrice(plan);
}

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    PlansAPI.list().then((res) => {
      if (res.success && res.data) setPlans(res.data);
      else setErr(res.error || 'خطا در دریافت پلن‌ها');
    });
  }, []);

  const durationLabel = (m: number) => ({ 1: '۱ ماهه', 3: '۳ ماهه', 6: '۶ ماهه', 12: '۱ ساله' } as Record<number, string>)[m];

  const handlePurchase = async (plan: Plan) => {
    if (!isAuthenticated) {
      router.push('/login?returnTo=/pricing');
      return;
    }
    setLoading(plan.id);
    const res = await PaymentAPI.request(plan.id);
    if (res.success && res.data) {
      window.location.href = res.data.paymentUrl;
    } else {
      alert(res.error || 'خطا در ایجاد پرداخت');
      setLoading(null);
    }
  };

  const PlanCard = ({ plan, featured }: { plan: Plan; featured?: boolean }) => {
    const final = discounted(plan);
    const hasDiscount = plan.discount > 0;
    return (
      <GlassCard className={`p-6 relative overflow-hidden ${featured ? 'ring-2 ring-purple-500/50' : ''}`}>
        {featured && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500" />}
        {hasDiscount && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold">
            {plan.discount}% تخفیف
          </div>
        )}
        <div className="flex items-center justify-between mb-4 mt-1">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${featured ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white' : 'bg-white/10 text-white/70'}`}>
            {durationLabel(plan.duration)}
          </span>
        </div>
        <div className="mb-5">
          {hasDiscount ? (
            <>
              <div className="text-white/40 text-lg line-through decoration-red-400/60">{formatPrice(plan.price)}</div>
              <div className="text-3xl font-bold text-white">{formatPrice(final)}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/50 text-sm">تومان</span>
                <span className="text-green-400 text-xs px-2 py-0.5 bg-green-500/10 rounded-full">صرفه‌جویی: {formatPrice(plan.price - final)} ت</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-white mb-1">{formatPrice(plan.price)}</div>
              <div className="text-white/50 text-sm">تومان</div>
            </>
          )}
        </div>
        <Button fullWidth variant={featured ? 'primary' : 'secondary'} loading={loading === plan.id} onClick={() => handlePurchase(plan)}>
          {isAuthenticated ? `خرید ${hasDiscount ? `با ${plan.discount}% تخفیف` : 'و پرداخت'}` : 'ورود برای خرید'}
        </Button>
      </GlassCard>
    );
  };

  const proPlans = plans.filter((p) => p.name === 'Pro');
  const ecoPlans = plans.filter((p) => p.name === 'Eco');

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">قیمت‌گذاری</h1>
          <p className="text-white/60 text-lg">پلن مناسب خود را انتخاب کنید</p>
        </div>

        {err && <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{err}</div>}

        {plans.length === 0 && !err ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400" /></div>
        ) : (
          <>
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-white text-center mb-8">پلن Pro</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {proPlans.map((p, i) => <PlanCard key={p.id} plan={p} featured={i === 1} />)}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white text-center mb-8">پلن Eco</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ecoPlans.map((p) => <PlanCard key={p.id} plan={p} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
