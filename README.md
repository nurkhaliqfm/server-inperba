# INPERBA - Informasi Perkara Banding PTTUN Makassar

**INPERBA** adalah aplikasi backend untuk monitoring dan pengelolaan informasi perkara banding di Pengadilan Tinggi Tata Usaha Negara (PTTUN) Makassar. Aplikasi ini dikembangkan dengan teknologi modern untuk mendukung performa, keamanan, dan automasi notifikasi WhatsApp ke pengguna terkait update perkara.

---

## Fitur Utama

- **Monitoring perkara banding** secara real-time di PTTUN Makassar
- **Manajemen user & autentikasi** menggunakan OAuth2.0 + JWT
- **Database** MySQL dengan integrasi Prisma ORM
- **WhatsApp Automation**: kirim OTP dan notifikasi perkara via WhatsApp menggunakan Baileys
- **Pengembangan automasi WhatsApp** untuk berbagai keperluan notifikasi internal/eksternal
- **API siap produksi, scalable & secure**

---

## Tech Stack

- [Bun](https://bun.sh/) - JavaScript runtime yang super cepat
- [Prisma ORM](https://www.prisma.io/) - ORM modern untuk TypeScript/JavaScript
- [OAuth2.0 + JWT](https://jwt.io/) - Standar autentikasi & otorisasi
- [MySQL](https://www.mysql.com/) - Database relasional
- [Baileys](https://github.com/adiwajshing/Baileys) - WhatsApp Web API client untuk Node.js/Bun
- [TypeScript](https://www.typescriptlang.org/)

---

## Instalasi & Setup

### 1. Clone Repo

```bash
git clone https://github.com/nurkhaliqfm/server-inperba.git
cd server-inperba
```

### 2. Instalasi Dependency

```bash
bun install
```

### 3. Konfigurasi Environment

Copy `.env.example` ke `.env` lalu sesuaikan variabelnya:

```bash
cp .env.example .env
# Edit .env sesuai kebutuhan (MySQL, JWT, OAuth, WhatsApp, dsb)
```

### 4. Setup Database

Inisialisasi dan migrasi database dengan Prisma:

```bash
bunx prisma migrate dev
```

```bash
bunx prisma db seed
```

### 5. Jalankan Server

```bash
bun run dev
```

---

## Fitur WhatsApp & OTP

- OTP dikirim otomatis ke nomor WhatsApp user menggunakan Baileys
- Notifikasi update perkara banding langsung ke WhatsApp user
- Siap dikembangkan untuk automasi WA lainnya (broadcast, reminder, dsb.)

---

## Autentikasi & Keamanan

- OAuth2.0 untuk login (siapkan kredensial di `.env`)
- JWT untuk sesi user & proteksi API
- Semua endpoint penting menggunakan middleware autentikasi

---

## Pengembangan & Testing

- Struktur modular
- API siap diintegrasikan dengan frontend/mobile
- Jalankan test:
  ```bash
  bun test
  ```

---

## Dokumentasi API

- [OpenAPI/Swagger] (jika tersedia) untuk eksplorasi endpoint
- Struktur endpoint: `/auth`, `/user`, `/perkara`, `/wa`, dsb.

---

## Kontribusi

Kontribusi terbuka! Silakan fork repository, buat branch baru, dan ajukan pull request.

---

## Lisensi

MIT License

---

## Kontak & Dukungan

- Pengembang: [@nurkhaliqfm](https://github.com/nurkhaliqfm)
- Email: nurkhaliqfm@gmail.com
- WhatsApp automation oleh: [Baileys](https://github.com/adiwajshing/Baileys)
- Untuk kebutuhan khusus, silakan buka issue di repo ini.
