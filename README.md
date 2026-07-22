# فرح · Farah

منصّة لتخطيط الأعراس تجمع في مكان واحد بين المقبلين على الزواج ومزوّدي الخدمات
(قاعات الأفراح والمصوّرين). العميل يتصفّح الخدمات، يحفظ ما يعجبه في المفضّلة،
يحجز، ويبني خطة زفافه ويشاركها مع شريكه؛ ومزوّد الخدمة يدير خدماته وصورها
وحجوزاته من لوحة خاصة به.

هذا مشروع التخرّج للمسار التأسيسي في Holberton School.

## الفريق

| العضو | الدور الأساسي |
|-------|----------------|
| Mohammed Alabdali | Frontend |
| Salman Almutairi | Team Lead · Backend |
| Abdullah Aldaghaym | Backend / Frontend |
| Fahad Alenzy | Backend / Frontend |

الأدوار تناوبت بين المراحل حتى يمرّ الجميع على الطرفين.

## التقنيات

**الواجهة الأمامية:** React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router
· React Hook Form + Zod · Axios

**الواجهة الخلفية:** Flask · SQLAlchemy · Marshmallow · Flask-JWT-Extended
· Flask-Bcrypt · PostgreSQL

## بنية المشروع

```
final-project/
├── back end/          # Flask API
│   └── app/
│       ├── models/          # جداول قاعدة البيانات (SQLAlchemy)
│       ├── repositories/    # الوصول للبيانات فقط
│       ├── services/        # منطق الأعمال + قواعد التحقّق
│       ├── schemas/         # تحقّق المدخلات وتنسيق المخرجات (Marshmallow)
│       ├── routes/          # نقاط النهاية (HTTP)
│       └── utils/           # مساعدات (JWT، كلمات المرور، الردود)
└── frontend/          # تطبيق React
    └── src/
        ├── features/        # كل ميزة في مجلد مستقل (auth, halls, bookings, ...)
        ├── components/      # مكوّنات مشتركة
        ├── services/        # طبقة الاتصال بالـ API
        └── routes/          # التوجيه والحُرّاس
```

كل مورد في الواجهة الخلفية يتبع نفس المسار:
`route → schema → service → repository → model`. وأي رد من الـ API يرجع
بنفس الشكل: `{ success, message, data }`.

## التشغيل محليًا

### المتطلبات

- Python 3.12
- Node.js 20+
- PostgreSQL 16

### 1) قاعدة البيانات

بعد تثبيت PostgreSQL، أنشئ قاعدة بيانات للمشروع:

```bash
sudo -u postgres createdb farah_db
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'your_password';"
```

### 2) الواجهة الخلفية

```bash
cd "back end"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

أنشئ ملف `.env` داخل `back end/` (انسخه من `.env.example`) وعدّل القيم:

```
SECRET_KEY=...
JWT_SECRET_KEY=...
DEV_DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/farah_db
```

> لتوليد مفتاح آمن: `python3 -c "import secrets; print(secrets.token_hex(32))"`

ثم شغّل الخادم (سيُنشئ الجداول تلقائيًا عند أول إقلاع):

```bash
python run.py
```

يعمل على `http://localhost:5000`.

### 3) الواجهة الأمامية

```bash
cd frontend
npm install
npm run dev
```

تعمل على `http://localhost:5173`.

## أبرز نقاط الـ API

جميع المسارات تبدأ بـ `/api`:

| المورد | المسار |
|--------|--------|
| المصادقة (تسجيل/دخول) | `/api/auth` |
| الخدمات | `/api/services` |
| القاعات | `/api/halls` |
| المصوّرون | `/api/photographers` |
| الحجوزات | `/api/bookings` |
| المفضّلة | `/api/favorites` |
| خطط الزفاف | `/api/wedding-plans` |

القراءة (تصفّح الخدمات) متاحة للجميع، أما الإنشاء والتعديل والحذف فتتطلّب
تسجيل دخول (JWT).

## ملاحظات وحدود حالية

- **صور الخدمات تُضاف عبر رابط مباشر** (URL) وليس رفع ملفات؛ لا توجد طبقة
  تخزين ملفات في المشروع بعد.
- **الدفع الإلكتروني** واجهته موجودة بعنوان "قريبًا" فقط، دون منطق فعلي.
- تُنشأ الجداول عبر `db.create_all()` عند الإقلاع؛ لتعديلات المخطّط اللاحقة
  يُفضّل الانتقال إلى ترحيلات Flask-Migrate.

## بيئة التطوير مقابل الإنتاج

الإعدادات مقسّمة في `app/config.py`:

- `DevelopmentConfig` — يقرأ `DEV_DATABASE_URL` (PostgreSQL محليًا).
- `ProductionConfig` — يقرأ `PROD_DATABASE_URL` (PostgreSQL على الاستضافة).
- `TestingConfig` — SQLite في الذاكرة.

يُحدَّد الوضع عبر متغيّر البيئة `FLASK_ENV` (`development` افتراضيًا).
