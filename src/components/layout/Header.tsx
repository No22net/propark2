'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/Button';

export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/images/logo.png" alt="Pro Park" width={140} height={40} className="h-10 w-auto object-contain" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-white/70 hover:text-purple-300 transition-colors">خانه</Link>
            <Link href="/pricing" className="text-white/70 hover:text-purple-300 transition-colors">قیمت‌ها</Link>
            {isAuthenticated && <Link href="/dashboard" className="text-white/70 hover:text-purple-300 transition-colors">پنل کاربری</Link>}
            {isAdmin && <Link href="/admin" className="text-white/70 hover:text-purple-300 transition-colors">پنل ادمین</Link>}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-white/60">{user?.name}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>خروج</Button>
              </>
            ) : (
              <>
                <Link href="/login"><Button variant="ghost" size="sm">ورود</Button></Link>
                <Link href="/register"><Button size="sm">ثبت‌نام</Button></Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-white/70" onClick={() => setOpen(!open)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-white/10 flex flex-col gap-3">
            <Link href="/" onClick={() => setOpen(false)} className="text-white/70 py-2">خانه</Link>
            <Link href="/pricing" onClick={() => setOpen(false)} className="text-white/70 py-2">قیمت‌ها</Link>
            {isAuthenticated && <Link href="/dashboard" onClick={() => setOpen(false)} className="text-white/70 py-2">پنل کاربری</Link>}
            {isAdmin && <Link href="/admin" onClick={() => setOpen(false)} className="text-white/70 py-2">پنل ادمین</Link>}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {isAuthenticated ? (
                <Button variant="secondary" size="sm" fullWidth onClick={handleLogout}>خروج</Button>
              ) : (
                <>
                  <Link href="/login"><Button variant="ghost" size="sm" fullWidth>ورود</Button></Link>
                  <Link href="/register"><Button size="sm" fullWidth>ثبت‌نام</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
