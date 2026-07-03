'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GlassCard } from './ui/GlassCard';
import { CaptchaAPI } from '@/lib/services';

interface CaptchaProps {
  onChange: (data: { token: string; answer: string }) => void;
}

/**
 * کپچای ریاضی — سؤال و توکن امضا شده از بک‌اند می‌آید.
 * پاسخ کاربر همراه توکن به بک‌اند ارسال و آنجا بررسی می‌شود.
 */
export function Captcha({ onChange }: CaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [question, setQuestion] = useState('');
  const [token, setToken] = useState('');
  const [answer, setAnswer] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);

  const fetchCaptcha = useCallback(async () => {
    const res = await CaptchaAPI.generate();
    if (res.success && res.data) {
      setQuestion(res.data.question);
      setToken(res.data.token);
      setAnswer('');
      setLoadFailed(false);
      onChange({ token: res.data.token, answer: '' });
    } else {
      setLoadFailed(true);
    }
  }, [onChange]);

  useEffect(() => { fetchCaptcha(); }, [fetchCaptcha]);

  useEffect(() => {
    if (!question) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 220, h = 70;
    canvas.width = w; canvas.height = h;

    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#1e1b4b'); g.addColorStop(0.5, '#312e81'); g.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.lineTo(Math.random() * w, Math.random() * h);
      ctx.strokeStyle = `rgba(168,85,247,${Math.random() * 0.3 + 0.1})`;
      ctx.lineWidth = Math.random() * 2 + 0.5; ctx.stroke();
    }
    for (let i = 0; i < 120; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`; ctx.fill();
    }

    const text = `${question} = ?`;
    text.split('').forEach((char, i) => {
      ctx.save();
      const x = 25 + i * 28;
      const y = 45 + (Math.random() - 0.5) * 8;
      ctx.translate(x, y); ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.font = 'bold 28px Vazirmatn, sans-serif';
      const tg = ctx.createLinearGradient(0, -10, 0, 10);
      tg.addColorStop(0, '#c084fc'); tg.addColorStop(1, '#7c3aed');
      ctx.fillStyle = tg; ctx.fillText(char, 0, 0); ctx.restore();
    });
  }, [question]);

  const handleAnswer = (val: string) => {
    setAnswer(val);
    onChange({ token, answer: val });
  };

  return (
    <GlassCard className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white/80">🔐 کپچای امنیتی</label>
        <button type="button" onClick={fetchCaptcha} className="text-xs text-purple-400 hover:text-purple-300">↻ جدید</button>
      </div>
      {loadFailed ? (
        <div className="text-center py-4 text-white/40 text-xs">
          کپچا بارگذاری نشد — بک‌اند را بررسی کنید
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <canvas ref={canvasRef} className="rounded-xl border border-purple-500/20" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="پاسخ را وارد کنید"
            value={answer}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-center font-mono tracking-widest placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            autoComplete="off"
          />
        </>
      )}
    </GlassCard>
  );
}
