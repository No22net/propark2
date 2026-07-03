import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageViewTracker } from '@/components/PageViewTracker';

export const metadata: Metadata = {
  title: 'Pro Park | پارکینگ هوشمند',
  description: 'سیستم مدیریت هوشمند پارکینگ برای صاحبان پارکینگ',
  icons: { icon: '/images/logo-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* فونت وزیرمتن — اختیاری. اگر مشکل لود داشت این خط را حذف کنید */}
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 min-h-screen text-white">
        <Providers>
          <PageViewTracker />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
