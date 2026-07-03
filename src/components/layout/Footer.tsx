import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-black/30 backdrop-blur-xl border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Image src="/images/logo.png" alt="Pro Park" width={130} height={36} className="h-9 w-auto object-contain" />
            <p className="text-white/60 text-sm leading-relaxed">
              سیستم مدیریت هوشمند پارکینگ برای صاحبان پارکینگ.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-semibold">لینک‌ها</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-white/60 hover:text-purple-400">خانه</Link></li>
              <li><Link href="/pricing" className="text-white/60 hover:text-purple-400">قیمت‌ها</Link></li>
              <li><Link href="/login" className="text-white/60 hover:text-purple-400">ورود</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-semibold">ارتباط با ما</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>📧 info@proparking.ir</li>
              <li>📞 ۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li>📍 تهران، خیابان ولیعصر</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          <p>© {new Date().getFullYear()} Pro Park. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
