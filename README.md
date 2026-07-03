# 🅿️ Pro Park — فرانت‌اند Next.js (فول API)

این یک **فرانت‌اند کامل و مستقل** است. هیچ بک‌اند داخلی ندارد و فقط از طریق API به بک‌اند شما وصل می‌شود.

---

## ⚡ راه‌اندازی

```bash
# ۱. نصب وابستگی‌ها
npm install

# ۲. تنظیم آدرس بک‌اند
cp .env.example .env.local
# سپس NEXT_PUBLIC_API_URL را به آدرس بک‌اند خود تغییر دهید

# ۳. اجرا
npm run dev
```

➡️ سایت روی **http://localhost:3000** اجرا می‌شود.

---

## 🌐 اتصال به بک‌اند

تنها تنظیم لازم در فایل `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

تمام درخواست‌ها به این آدرس ارسال می‌شوند. توکن احراز هویت در `localStorage` ذخیره و به‌صورت خودکار در هدر `Authorization: Bearer <token>` فرستاده می‌شود.

---

## 📡 endpointهایی که بک‌اند شما باید پیاده‌سازی کند

نقشه کامل در `src/lib/services.ts` است. خلاصه:

### احراز هویت
| متد | مسیر | پاسخ |
|-----|------|------|
| POST | `/auth/login` | `{ user, token }` |
| POST | `/auth/register` | `{ user, token }` |
| POST | `/auth/logout` | — |
| GET | `/auth/me` | `User` |

### کاربران (ادمین)
| متد | مسیر |
|-----|------|
| GET | `/users` |
| PATCH | `/users/:id/role` |
| DELETE | `/users/:id` |

### پلن‌ها
| متد | مسیر | دسترسی |
|-----|------|--------|
| GET | `/plans` | عمومی |
| PATCH | `/plans/:id` | ادمین |

### اشتراک‌ها
| متد | مسیر |
|-----|------|
| GET | `/subscriptions` (ادمین) |
| GET | `/subscriptions/me` |
| POST | `/subscriptions/:id/cancel` |
| POST | `/subscriptions/:id/renew` |
| POST | `/subscriptions/user/:userId/token` |
| POST | `/admin/activate-service` |

### خریدها
| متد | مسیر |
|-----|------|
| GET | `/purchases` (ادمین) |
| GET | `/purchases/me` |

### پرداخت
| متد | مسیر | پاسخ |
|-----|------|------|
| POST | `/payment/request` | `{ authority, paymentUrl }` |
| POST | `/payment/verify` | `{ token, refId, planName, amount }` |

### آمار (ادمین)
| متد | مسیر |
|-----|------|
| GET | `/analytics/dashboard` |
| GET | `/analytics/activity` |
| POST | `/analytics/page-view` |

### تنظیمات و کپچا
| متد | مسیر |
|-----|------|
| GET/PATCH | `/settings` |
| GET | `/captcha` → `{ question, token }` |

---

## 📦 فرمت پاسخ بک‌اند

هر پاسخ باید یکی از این دو فرمت باشد:

```json
{ "success": true, "data": { ... } }
```
یا مستقیماً داده:
```json
{ "id": "...", "name": "..." }
```

در صورت خطا:
```json
{ "success": false, "error": "متن خطا" }
```

---

## 📁 ساختار

```
src/
├── app/                 # صفحات (App Router)
│   ├── page.tsx         # خانه
│   ├── login/, register/
│   ├── pricing/, dashboard/
│   ├── admin/           # پنل ادمین کامل
│   └── callback/        # بازگشت از درگاه
├── components/          # کامپوننت‌های UI
├── contexts/
│   └── AuthContext.tsx  # مدیریت نشست با توکن
├── lib/
│   ├── api.ts           # کلاینت HTTP
│   ├── services.ts      # 🎯 نقشه API بک‌اند
│   └── utils.ts
└── types/
```

---

## 🏗️ بیلد production
```bash
npm run build
npm run start
```

## 🖼️ تصاویر
عکس‌ها را در `public/images/` قرار دهید: `logo.png`, `logo-icon.png`, `app-1.jpg` تا `app-4.jpg`.
