'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GlassCard } from './ui/GlassCard';

const slides = [
  { image: '/images/app-1.jpg', title: 'پنل مدیریت تعرفه‌ها', description: 'تنظیم نرخ پایه، تعرفه‌های VIP و سازمانی، تعرفه پلکانی و تخفیف‌های مناسبتی' },
  { image: '/images/app-2.jpg', title: 'مدیریت دوربین‌های هوشمند', description: 'اتصال دوربین‌های تشخیص پلاک از طریق USB، RTSP و HTTP/MJPEG' },
  { image: '/images/app-3.jpg', title: 'مدیریت ساختار پارکینگ', description: 'تعریف طبقات، بلوک‌ها، ردیف‌ها و جایگاه‌ها' },
  { image: '/images/app-4.jpg', title: 'جستجوی پلاک و سوابق', description: 'جستجوی سریع خودروها بر اساس پلاک ایران با تاریخچه ورود و خروج' },
];

export function AppShowcase() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [errored, setErrored] = useState<Record<number, boolean>>({});

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, paused]);

  const slide = slides[current];

  return (
    <div className="relative max-w-5xl mx-auto" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <GlassCard className="p-2 overflow-hidden ring-1 ring-purple-500/20">
        <div className="relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-slate-800/80 to-slate-900/80">
          {!errored[current] ? (
            <Image src={slide.image} alt={slide.title} fill className="object-cover" onError={() => setErrored((p) => ({ ...p, [current]: true }))} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-purple-400/40">
              <code dir="ltr" className="text-xs">public{slide.image}</code>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{slide.title}</h3>
            <p className="text-white/70 text-sm sm:text-base">{slide.description}</p>
          </div>
          <button onClick={prev} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-purple-500/40">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={next} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-purple-500/40">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={next} className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white/80 text-xs hover:bg-purple-500/40">رد کردن ⟫</button>
        </div>
      </GlassCard>
      <div className="flex items-center justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-gradient-to-r from-purple-500 to-violet-500' : 'w-2 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
}
