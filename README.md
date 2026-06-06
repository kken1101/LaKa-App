# LaKa — Hướng dẫn Deploy lên Vercel

## Cấu trúc project
```
laka-deploy/
├── public/
│   └── index.html       ← App chính (S0→S14)
├── api/
│   ├── ai.js            ← Gemini proxy (giấu API key)
│   └── track.js         ← Analytics event collector
├── vercel.json          ← Routing config
└── README.md
```

---

## Bước 1 — Tạo tài khoản Vercel (miễn phí)
1. Vào **https://vercel.com** → Sign Up → dùng GitHub account
2. Cài Vercel CLI (tuỳ chọn): `npm i -g vercel`

---

## Bước 2 — Upload code lên GitHub
1. Vào **https://github.com/new** → tạo repo tên `laka-app`
2. Upload toàn bộ folder `laka-deploy/` lên repo đó
3. Hoặc dùng GitHub Desktop nếu không quen CLI

---

## Bước 3 — Deploy trên Vercel
1. Vào **https://vercel.com/new**
2. Import GitHub repo `laka-app`
3. **KHÔNG** cần thay đổi gì ở build settings — Vercel tự detect
4. Nhấn **Deploy** → đợi ~1 phút

---

## Bước 4 — Cấu hình Environment Variables (QUAN TRỌNG)
Trong Vercel Dashboard → Settings → **Environment Variables**, thêm:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | `AIzaSyCkS2jaOX00yYY_00CbPcSndCgAX8qLlNk` |

> ⚠️ Đây là bước BẮT BUỘC để AI hoạt động.
> Key này sẽ ẩn hoàn toàn, không lộ ra ngoài client.

Sau khi thêm → nhấn **Redeploy**.

---

## Bước 5 — Xem Analytics
### Vercel Function Logs (miễn phí):
- Dashboard → chọn project → tab **Functions**
- Tìm `/api/track` → click → xem **Logs**
- Filter bằng keyword `LAKA_EVT` để xem events

### Events được track:
| Event | Trigger |
|-------|---------|
| `session_start` | User mở app |
| `screen_view` | Mỗi lần chuyển màn hình |
| `onboarding_start` | Nhập tên xong, bấm Bắt đầu |
| `vibe_selected` | Chọn vibe |
| `ai_generate_start` | Bắt đầu gọi AI |
| `ai_generate_success` | AI trả về lịch trình |
| `ai_generate_fail` | AI lỗi (có error message) |
| `stamp_earned` | Hoàn thành chuyến đi (CONVERSION) |
| `app_background` | User tắt tab/khóa màn hình |
| `app_foreground` | User quay lại app |

---

## Bước 6 — Custom Domain (tuỳ chọn)
- Vercel cho domain miễn phí: `laka-app.vercel.app`
- Thêm domain riêng: Settings → Domains → Add `laka.app`

---

## Nâng cấp Analytics (sau demo)
Khi cần dashboard đẹp hơn, pipe events sang:
- **Google Analytics 4** — free, dashboard có sẵn
- **Mixpanel** — free tier 20M events/tháng
- **Tinybird** — real-time SQL trên events
- **Google Sheets** — đơn giản nhất, thêm webhook vào `/api/track.js`

Uncomment phần `WEBHOOK_URL` trong `api/track.js` và thêm env var.
