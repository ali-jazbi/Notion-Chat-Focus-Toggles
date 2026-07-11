# Notion Chat Focus Toggles

A lightweight Chrome extension that lets you hide/show parts of a Notion AI
chat with one click, so you can focus on exactly what you need:

- Hide/show code blocks
- Hide/show your own prompts
- Hide/show the AI's non-code explanation text

Each toggle works independently. A shared **percentage slider** lets you
limit hides to only the oldest N% of the conversation — for example, set it
to 50% and only the older half of the chat is affected by the active
toggles; the newer half always stays fully visible. As the conversation
grows, the cutoff point automatically shifts.

A "Show All / Reset" button restores everything at once.

## Why

Long AI chats in Notion get cluttered with code blocks and explanatory
text, making it hard to scan for exactly what you need. This extension
lets you temporarily hide the noise — without deleting or altering any
actual content.

## Install

1. Download and extract the `notion-focus-toggles.zip` file into its own folder.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the extracted folder.
5. Confirm "Notion Chat Focus Toggles" now appears in your extensions list.

## Usage

1. Open any Notion AI chat page (`notion.so` or `notion.site`).
2. Click the extension's icon in the Chrome toolbar.
3. Click any of the three buttons to hide that type of content; click again to bring it back.
4. Drag the percentage slider to control how far back (from the oldest message) the active hides should apply.
5. Click **Show All (Reset)** to clear all active hides at once.

Each button turns blue while its hide is active, so you always know what's currently hidden.

## Notes

- Works only on Notion pages (`*.notion.so`, `notion.so`, `*.notion.site`).
- Purely visual: hidden content is not deleted, only hidden. Reloading the page or clicking the button again restores it.
- Settings (which toggles are active and the percentage) are remembered per browser profile via `chrome.storage.local`.
- If a future Notion layout update changes some CSS class names, the selectors in `content.js` may need updating.

## License

MIT


------------


🌐 فارسی | **[English](README.md)**

# Notion Chat Focus Toggles

یک اکستنشن ساده و سبک برای کروم که به شما اجازه می‌دهد با یک کلیک، بخش‌های
مختلف چت هوش مصنوعی Notion را مخفی یا نمایش دهید تا فقط روی همان چیزی که
نیاز دارید تمرکز کنید:

- مخفی/نمایش کدباکس‌ها
- مخفی/نمایش پرامپت‌های خودتان
- مخفی/نمایش توضیحات غیرکد (متن‌های توضیحی هوش مصنوعی)

هر دکمه مستقل عمل می‌کند. یک **نوار درصد مشترک** هم وجود دارد که به شما
اجازه می‌دهد این مخفی‌سازی‌ها را فقط به قدیمی‌ترین N درصد مکالمه محدود
کنید — مثلاً روی ۵۰٪ بگذارید تا فقط نیمه‌ی قدیمی‌تر چت تحت تأثیر قرار
بگیرد و نیمه‌ی جدیدتر همیشه کامل نمایش داده شود. با ادامه‌ی مکالمه، این
مرز به‌صورت خودکار جابه‌جا می‌شود.

دکمه‌ی «نمایش همه / ریست» هم همه‌چیز را یک‌جا برمی‌گرداند.

## به چه دردی می‌خورد؟

چت‌های طولانی هوش مصنوعی در Notion پر از کدباکس و متن‌های توضیحی می‌شوند
که پیدا کردن دقیقاً همان چیزی که نیاز دارید را سخت می‌کند. این اکستنشن به
شما اجازه می‌دهد این شلوغی را به‌طور موقت پنهان کنید — بدون این‌که هیچ
محتوایی واقعاً حذف یا تغییر داده شود.

## نصب

۱. فایل `notion-focus-toggles.zip` را دانلود و در یک پوشه‌ی جدید استخراج کنید.
۲. در کروم به آدرس `chrome://extensions` بروید.
۳. گزینه‌ی **Developer mode** (بالا-راست صفحه) را روشن کنید.
۴. روی **Load unpacked** کلیک کنید و پوشه‌ای که استخراج کردید را انتخاب کنید.
۵. مطمئن شوید که «Notion Chat Focus Toggles» در لیست اکستنشن‌ها ظاهر شده است.

## نحوه‌ی استفاده

۱. یک صفحه‌ی چت هوش مصنوعی Notion را باز کنید (آدرس `notion.so` یا `notion.site`).
۲. روی آیکون اکستنشن در نوار ابزار کروم کلیک کنید.
۳. روی هرکدام از سه دکمه بزنید تا همان نوع محتوا مخفی شود؛ دوباره بزنید تا برگردد.
۴. نوار درصد را تنظیم کنید تا مشخص کنید مخفی‌سازی‌ها فقط تا کجای چت (از ابتدا) اعمال شود.
۵. برای برگرداندن همه‌چیز یک‌جا، روی **نمایش همه (ریست)** بزنید.

دکمه‌ای که فعال باشد آبی می‌شود، پس همیشه معلوم است چه چیزی الان مخفی شده.

## نکات

- فقط روی صفحات Notion کار می‌کند (`notion.so` و `notion.site`).
- تغییرات فقط بصری هستند؛ هیچ داده‌ای حذف نمی‌شود.
- تنظیمات (کدام دکمه‌ها فعال‌اند و درصد نوار) در مرورگر ذخیره می‌شود و از دست نمی‌رود.
- اگر Notion در آپدیت بعدی نام کلاس‌های CSS خودش را تغییر دهد، ممکن است لازم باشد سلکتورهای داخل `content.js` به‌روزرسانی شوند.

## مجوز

MIT