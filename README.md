# I'm Nafis - Personal Portfolio

Repository ini berisi source code untuk website personal portfolio Nafis: sebuah landing page publik dan admin dashboard untuk mengelola konten dinamis.

Website production: https://im-nafis.vercel.app

## Ringkasan

Website ini dirancang sebagai portfolio pribadi yang menampilkan profil, track record, karya pilihan, produk digital, dan CTA kontak. Konten utama dikelola dari halaman admin dan disimpan di Supabase.

Status stabil saat ini: `stable-v1-public-admin`

## Fitur Publik

- Hero section dengan profil utama dan CTA kontak.
- Track Record: riwayat pendidikan, pencapaian utama, kepemimpinan/organisasi, dan keahlian inti.
- Karya Pilihan berbasis carousel ringan.
- Modal detail karya.
- Video portfolio dapat diputar melalui modal dengan fallback ke Google Drive.
- Produk Digital untuk layanan atau penawaran.
- Tema terang/gelap.
- Responsive layout untuk HP, desktop HP, tablet, dan laptop.
- Robots dan sitemap untuk SEO dasar.

## Fitur Admin

- Login admin berbasis Supabase Auth.
- Dashboard admin untuk mengelola:
  - profil utama,
  - social links,
  - track record,
  - portfolio/karya,
  - produk digital.
- Tambah, edit, dan hapus data.
- Preview media untuk gambar/video.
- Konfirmasi hapus dengan nama item.
- Disabled/loading state saat proses simpan atau hapus.
- Public page memakai revalidation pendek agar update admin cepat terlihat.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Database, Auth, dan Storage
- Vercel Deployment
- Framer Motion
- Lucide React

## Struktur Route

```text
/              Halaman portfolio publik
/admin         Dashboard admin
/admin/login   Login admin
/robots.txt    Robots metadata
/sitemap.xml   Sitemap metadata
```

## Environment Variables

Buat file `.env.local` di root project.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jangan commit `.env.local`. File `.gitignore` sudah memblokir `.env*`.

## Development

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Validasi sebelum push:

```bash
npm run lint
npm run build
```

## Deployment

Project dideploy melalui Vercel.

Production branch: `main`

Setiap perubahan production sebaiknya melewati validasi:

```bash
npm run lint
npm run build
```

## Supabase Security Notes

- RLS aktif pada tabel konten utama.
- Public user hanya digunakan untuk membaca data yang memang tampil di halaman publik.
- Operasi insert, update, dan delete dibatasi ke UID admin.
- Storage write policy untuk bucket publik dibatasi ke UID admin.
- Jangan menyimpan service role key di client atau repository.

## PageSpeed Baseline

Baseline production terakhir:

```text
Mobile
Performance: 95
Accessibility: 100
Best Practices: 100
SEO: 100
CLS: 0

Desktop
Performance: 100
Accessibility: 100
Best Practices: 100
SEO: 100
CLS: 0
```

Catatan: mobile performance dapat sedikit berubah antar pengujian karena kondisi jaringan, device emulation, dan variasi Lighthouse.

## Maintenance

Checklist sebelum melakukan perubahan besar:

- Pastikan working tree bersih.
- Buat branch baru untuk eksperimen.
- Jalankan `npm run lint` dan `npm run build`.
- Cek homepage di HP biasa, mode desktop HP, dan laptop.
- Cek `/admin/login` dan `/admin`.
- Jalankan PageSpeed ulang jika perubahan menyentuh halaman publik.
- Jangan menjalankan `npm audit fix --force` tanpa review manual.

## Status Dependency

Jika `npm audit --omit=dev` menampilkan moderate issue dari dependency internal Next/PostCSS, jangan langsung memakai `npm audit fix --force` karena dapat menyebabkan downgrade/breaking change. Evaluasi update Next patch/minor secara manual dan pastikan lint/build tetap aman.

## License

Personal project. All rights reserved unless stated otherwise.
