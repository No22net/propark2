'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { PaymentAPI } from '@/lib/services';
import { formatPrice } from '@/lib/utils';

function CallbackContent() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ success: boolean; token?: string; refId?: string; planName?: string; amount?: number; error?: string } | null>(null);

  useEffect(() => {
    // بک‌اند شما ممکن است پارامترهای مختلفی برگرداند — اینجا استاندارد زرین‌پال
    const authority = params.get('Authority') || params.get('authority');
    const status = params.get('Status') || params.get('status');
    const planId = params.get('planId');

    if (!authority || (status && status !== 'OK') || !planId) {
      setResult({ success: false, error: 'پرداخت لغو شد یا ناموفق بود' });
      setLoading(false);
      return;
    }

    PaymentAPI.verify(authority, planId).then((res) => {
      if (res.success && res.data) {
        setResult({ success: true, ...res.data });
      } else {
        setResult({ success: false, error: res.error || 'خطا در تأیید پرداخت' });
      }
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return (
      <GlassCard className="p-12 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-semibold text-white mb-2">در حال بررسی پرداخت...</h2>
      </GlassCard>
    );
  }

  if (result?.success) {
    return (
      <GlassCard className="p-8 max-w-lg w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">پرداخت موفق!</h1>
        <p className="text-white/60 mb-6">اشتراک شما با موفقیت فعال شد</p>
        <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3 text-right">
          <div className="flex justify-between"><span className="text-white/60 text-sm">پلن:</span><span className="text-white text-sm">{result.planName}</span></div>
          <div className="flex justify-between"><span className="text-white/60 text-sm">مبلغ:</span><span className="text-purple-400 text-sm font-semibold">{result.amount ? formatPrice(result.amount) : '-'} تومان</span></div>
          {result.refId && <div className="flex justify-between"><span className="text-white/60 text-sm">کد پیگیری:</span><span className="text-white text-sm font-mono" dir="ltr">{result.refId}</span></div>}
        </div>
        {result.token && (
          <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-xl p-4 mb-6">
            <h3 className="text-purple-400 text-sm font-medium mb-2">🔑 توکن فعال‌سازی</h3>
            <div className="bg-black/30 rounded-lg p-3"><code className="text-white text-sm break-all font-mono" dir="ltr">{result.token}</code></div>
          </div>
        )}
        <div className="flex gap-3">
          <Link href="/dashboard" className="flex-1"><Button fullWidth>پنل کاربری</Button></Link>
          <Link href="/pricing" className="flex-1"><Button variant="secondary" fullWidth>قیمت‌ها</Button></Link>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8 max-w-lg w-full text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">پرداخت ناموفق</h1>
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"><p className="text-red-400 text-sm">{result?.error}</p></div>
      <div className="flex gap-3">
        <Link href="/pricing" className="flex-1"><Button fullWidth>تلاش مجدد</Button></Link>
        <Link href="/dashboard" className="flex-1"><Button variant="secondary" fullWidth>پنل کاربری</Button></Link>
      </div>
    </GlassCard>
  );
}

export default function CallbackPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400" />}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
