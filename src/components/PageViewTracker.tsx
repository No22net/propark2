'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnalyticsAPI } from '@/lib/services';

function getVisitorId(): string {
  let id = localStorage.getItem('proparking_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('proparking_visitor_id', id);
  }
  return id;
}

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin') || pathname.startsWith('/callback')) return;
    // اگر بک‌اند هنوز آماده نیست، خطا نادیده گرفته می‌شود
    AnalyticsAPI.trackPageView(pathname, getVisitorId()).catch(() => {});
  }, [pathname]);

  return null;
}
