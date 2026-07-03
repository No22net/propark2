import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat('fa-IR').format(n);
}

export function formatDate(d: string | Date): string {
  return new Date(d).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDateTime(d: string | Date): string {
  return new Date(d).toLocaleString('fa-IR');
}

export function getRemainingDays(endDate: string | Date): number {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// اعتبارسنجی رمز عبور
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) return { valid: false, error: 'رمز عبور باید حداقل ۸ کاراکتر باشد' };
  if (!/[a-z]/.test(password)) return { valid: false, error: 'رمز عبور باید شامل حرف کوچک انگلیسی باشد' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'رمز عبور باید شامل حرف بزرگ انگلیسی باشد' };
  return { valid: true };
}

export function getPasswordStrength(password: string) {
  const checks = [
    { label: 'حداقل ۸ کاراکتر', passed: password.length >= 8 },
    { label: 'حرف کوچک (a-z)', passed: /[a-z]/.test(password) },
    { label: 'حرف بزرگ (A-Z)', passed: /[A-Z]/.test(password) },
    { label: 'عدد یا نماد', passed: /[0-9!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter((c) => c.passed).length;
  const labels = ['خیلی ضعیف', 'ضعیف', 'متوسط', 'خوب', 'قوی'];
  const colors = ['bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  return { score, label: labels[score], color: colors[score], checks };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// تبدیل ارقام فارسی به انگلیسی
export function normalizeDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}
