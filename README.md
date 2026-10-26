# MYK Interaktif · Landing Page

Etalase seluruh karya di [github.com/mykinteraktif](https://github.com/mykinteraktif): lab maya, game edukasi, dan contoh proyek web untuk siswa SMK.

## Fitur

- Kartu karya lengkap dengan thumbnail, mapel, kelas/fase, deskripsi, dan tag.
- Filter kategori (Lab Maya, Game Edukasi, Website & RPL), pencarian, dan urutan (terbaru, A–Z, unggulan).
- Tombol **Buka**, **Salin tautan** (untuk dibagikan ke grup kelas), dan **Kode sumber**.
- **Sinkron otomatis dengan GitHub**: repo publik baru langsung muncul sebagai kartu "Karya Baru" tanpa mengubah kode; tanggal pembaruan ikut diperbarui.
- Bagian **Profil Penyusun**: foto, biodata, portofolio singkat (dihitung otomatis), keahlian, dan tautan LinkedIn/Instagram/GitHub.
- Mode terang/gelap, responsif untuk HP, tanpa build tool.

## Struktur

```
index.html          halaman utama
style.css           tampilan
script.js           logika (render, filter, sinkron GitHub)
data.js             daftar karya + biodata profil  ← edit di sini
assets/foto-profil.webp  foto profil (latar transparan)
assets/thumbs/      thumbnail tiap karya (640×400, .webp)
```

## Menambah / merapikan karya baru

1. Buka `data.js`, salin satu blok `{ ... }` di dalam `PROYEK`, lalu isi `repo`, `judul`, `kategori`, `mapel`, `kelas`, `deskripsi`, dan `tag`.
2. Simpan screenshot karya sebagai `assets/thumbs/<nama-repo>.webp` (rasio 16:10).
3. Commit dan push. Tanpa langkah ini pun repo baru tetap tampil otomatis, hanya dengan kartu sederhana.

## Mengubah biodata

Edit objek `PROFIL` di `data.js` (peran, bio, biodata, keahlian, bidang, sosial). Baris yang dikosongkan tidak ditampilkan. Ganti foto dengan menimpa `assets/foto-profil.webp` (rasio 4:5).

## Publikasi di GitHub Pages

1. Buka **Settings → Pages** di repo ini.
2. Pada **Source** pilih **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Situs akan tersedia di `https://mykinteraktif.github.io/landingpage/`.

> Ingin alamat utama `https://mykinteraktif.github.io/`? Ganti nama repo ini menjadi `mykinteraktif.github.io`.

---

Disusun oleh Mohammad Yusron Kholish, S.Kom · SMKS PGRI Singosari
