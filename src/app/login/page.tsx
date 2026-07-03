'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Captcha } from '@/components/Captcha';
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const returnTo = params.get('returnTo') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState({ token: '', answer: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!captcha.answer) { setError('لطفاً کپچا را حل کنید'); return; }
    if (!email || !password) { setError('لطفاً تمام فیلدها را پر کنید'); return; }

    setLoading(true);
    const res = await login(email, password, captcha);
    setLoading(false);

    if (res.success) {
      router.push(returnTo);
    } else {
      setError(res.error || 'خطا در ورود');
    }
  };

  return (
    <div className="relative w-full max-w-md mx-4">
      <GlassCard className="p-8 ring-1 ring-purple-500/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-white">ورود به حساب</h1>
          <p className="text-white/60 mt-2">خوش آمدید! لطفاً وارد شوید</p>
        </div>

        {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="ایمیل" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="رمز عبور" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Captcha onChange={setCaptcha} />
          <Button type="submit" fullWidth loading={loading}>ورود</Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">حساب کاربری ندارید؟ <Link href="/register" className="text-purple-400 hover:text-purple-300">ثبت‌نام کنید</Link></p>
        </div>
      </GlassCard>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
