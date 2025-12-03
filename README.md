# 🚀 Salla Webhook Sender - Chrome Extension

[![GitHub](https://img.shields.io/badge/GitHub-order__create__urscript-blue?logo=github)](https://github.com/blackangiliq/order_create_urscript)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?logo=googlechrome)](https://github.com/blackangiliq/order_create_urscript)

## 📋 الوصف
إضافة Chrome لإرسال webhook تلقائياً لحدث `order.created` في منصة سلة.

> **🔗 GitHub Repository:** https://github.com/blackangiliq/order_create_urscript

## 🚀 طريقة التثبيت

### طريقة 1: التحميل من GitHub
```bash
# نسخ المشروع
git clone https://github.com/blackangiliq/order_create_urscript.git

# أو تحميل ZIP من GitHub
# ثم فك الضغط
```

### طريقة 2: تحميل مباشر
1. اذهب إلى: https://github.com/blackangiliq/order_create_urscript
2. اضغط `Code` → `Download ZIP`
3. فك ضغط الملف

### تثبيت الإضافة في Chrome
1. افتح Chrome واذهب إلى: `chrome://extensions/`
2. فعّل "وضع المطور" (Developer mode) في الزاوية العلوية
3. اضغط على "Load unpacked" (تحميل بدون حزم)
4. اختر مجلد `order_create_urscript`

### 2. الاستخدام

#### الطريقة الأولى: عبر زر في الصفحة
1. افتح رابط: `https://s.salla.sa/settings/component/webhooks`
2. سيظهر زر جديد بجانب زر "إضافة جديد" باسم **"إرسال Order.Created"**
3. اضغط على الزر لإرسال الـ webhook تلقائياً

#### الطريقة الثانية: عبر popup الإضافة
1. افتح صفحة: `https://s.salla.sa/settings/component/webhooks`
2. اضغط على أيقونة الإضافة في شريط الأدوات
3. يمكنك تعديل URL الخاص بالـ webhook
4. اضغط على زر "إرسال Webhook"

## ⚙️ البيانات المرسلة

الإضافة ترسل webhook بالبيانات التالية:
- **Event**: `order.created`
- **Version**: `2`
- **Name**: `انشاء الطلب`
- **URL**: `https://urscript.shop:3000/webhook` (قابل للتعديل)

## 📝 ملاحظات
- يجب أن تكون مسجل دخول في حسابك على سلة
- الإضافة تعمل فقط في صفحة Webhooks
- يتم استخدام الـ tokens الموجودة في الصفحة تلقائياً

## 🔧 الملفات

```
urscript_exteinton/
├── manifest.json       # إعدادات الإضافة
├── content.js         # السكريبت المحقون في الصفحة
├── popup.html         # واجهة popup
├── popup.js           # منطق popup
└── README.md          # هذا الملف
```

## 🛠️ التطوير

### تعديل URL الافتراضي
عدّل في ملف `content.js` السطر:
```javascript
formData.append('url', 'https://urscript.shop:3000/webhook');
```

### تعديل Event
عدّل في ملف `content.js` السطر:
```javascript
formData.append('event', 'order.created');
```

## 📞 الدعم
إذا واجهت أي مشاكل، تحقق من:
1. Console في Chrome DevTools (F12)
2. أنك في الصفحة الصحيحة
3. أنك مسجل دخول في سلة

## 📜 الترخيص
هذه الإضافة للاستخدام الشخصي.

