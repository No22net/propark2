'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Captcha } from '@/components/Captcha';
import { useAuth } from '@/contexts/AuthContext';
import { getPasswordStrength, validatePassword, validateEmail } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captcha, setCaptcha] = useState({ token: '', answer: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!captcha.answer) { setError('لطفاً کپچا را حل کنید'); return; }
    if (name.length < 2) { setError('نام باید حداقل ۲ کاراکتر باشد'); return; }
    if (!validateEmail(email)) { setError('ایمیل نامعتبر است'); return; }
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) { setError(pwCheck.error!); return; }
    if (password !== confirmPassword) { setError('رمزهای عبور مطابقت ندارند'); return; }

    setLoading(true);
    const res = await register({ name, email, password, captcha });
    setLoading(false);

    if (res.success) router.push('/dashboard');
    else setError(res.error || 'خطا در ثبت‌نام');
  };

  return (
    <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md mx-4">
        <GlassCard className="p-8 ring-1 ring-purple-500/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-white">ایجاد حساب کاربری</h1>
            <p className="text-white/60 mt-2">به خانواده Pro Park بپیوندید</p>
          </div>

          {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="نام کامل" value={name} onChange={(e) => setName(e.target.value)} placeholder="نام خود را وارد کنید" />
            <Input label="ایمیل" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" />
            <Input label="رمز عبور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="حداقل ۸ کاراکتر، حروف بزرگ و کوچک" />

            {password && (
              <div className="space-y-2 -mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i < strength.score ? strength.color : 'bg-white/10'}`} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {strength.checks.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                      <span className={c.passed ? 'text-green-400' : 'text-white/30'}>{c.passed ? '✓' : '○'}</span>
                      <span className={c.passed ? 'text-white/70' : 'text-white/40'}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Input label="تکرار رمز عبور" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="رمز عبور را مجدداً وارد کنید" />
            <Captcha onChange={setCaptcha} />
            <Button type="submit" fullWidth loading={loading}>ثبت‌نام</Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">قبلاً ثبت‌نام کرده‌اید؟ <Link href="/login" className="text-purple-400 hover:text-purple-300">وارد شوید</Link></p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
