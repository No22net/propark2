'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { AppShowcase } from '@/components/AppShowcase';
import { AnalyticsAPI } from '@/lib/services';
import { formatPrice } from '@/lib/utils';
import { TeamMember } from '@/types';

const team: TeamMember[] = [
  { id: '1', name: 'ابراهیم محمدیان', role: 'متخصص هوش مصنوعی', specialty: 'آموزش ماشین، Python', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
  { id: '2', name: 'متین قادریان', role: 'متخصص فرانت‌اند', specialty: 'آموزش ماشین', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' },
  { id: '3', name: 'عدنان محمودی', role: 'متخصص بک‌اند', specialty: 'سرور و زیرساخت', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face' },
  { id: '4', name: 'آراد علی‌پور', role: 'متخصص سخت‌افزار', specialty: 'IoT و الکترونیک', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face' },
];

const features = [
  { title: 'داشبورد هوشمند', description: 'مشاهده لحظه‌ای وضعیت پارکینگ' },
  { title: 'تحلیل داده‌ها', description: 'گزارش‌های دقیق از درآمد و ترافیک' },
  { title: 'امنیت بالا', description: 'احراز هویت پیشرفته و محافظت داده‌ها' },
  { title: 'سرعت بالا', description: 'پردازش سریع تردد خودروها' },
];

export default function HomePage() {
  const [stats, setStats] = useState([
    { value: '—', label: 'کاربران ثبت‌نام شده' },
    { value: '—', label: 'اشتراک فعال' },
    { value: '—', label: 'کل بازدید' },
    { value: '۲۴/۷', label: 'پشتیبانی' },
  ]);

  useEffect(() => {
    AnalyticsAPI.dashboard().then((res) => {
      if (res.success && res.data) {
        const d = res.data;
        setStats([
          { value: formatPrice(d.totalUsers), label: 'کاربران ثبت‌نام شده' },
          { value: formatPrice(d.activeSubscriptions), label: 'اشتراک فعال' },
          { value: formatPrice(d.totalPageViews), label: 'کل بازدید' },
          { value: '۲۴/۷', label: 'پشتیبانی' },
        ]);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm mb-8">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" /> نسخه ۱.۰ منتشر شد
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              مدیریت هوشمند
              <span className="block mt-2 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">پارکینگ شما</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              با استفاده از هوش مصنوعی و فناوری‌های پیشرفته، پارکینگ خود را بهینه کنید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing"><Button size="lg">مشاهده قیمت‌ها</Button></Link>
              <Link href="/register"><Button variant="secondary" size="lg">شروع رایگان</Button></Link>
            </div>
          </div>
          <div className="mt-16"><AppShowcase /></div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">امکانات ویژه</h2>
            <p className="text-white/60">مجموعه‌ای کامل از ابزارها برای مدیریت حرفه‌ای پارکینگ</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <GlassCard key={i} hover className="p-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/60 text-sm">{f.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-1">{s.value}</div>
                  <div className="text-white/50 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">تیم ما</h2>
            <p className="text-white/60">چهار مهندس کامپیوتر با تخصص‌های متفاوت</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <GlassCard key={m.id} hover className="p-6 text-center">
                <div className="relative mx-auto w-28 h-28 mb-4">
                  <Image src={m.image} alt={m.name} fill className="rounded-full object-cover border-2 border-purple-500/30" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{m.name}</h3>
                <p className="text-purple-400 text-sm mb-1">{m.role}</p>
                <p className="text-white/50 text-xs">{m.specialty}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">آماده شروع هستید؟</h2>
              <p className="text-white/60 mb-8">همین حالا ثبت‌نام کنید و پارکینگ خود را هوشمند کنید</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing"><Button size="lg">مشاهده قیمت‌ها</Button></Link>
                <Link href="/register"><Button variant="secondary" size="lg">ثبت‌نام رایگان</Button></Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
