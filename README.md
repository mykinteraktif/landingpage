# MYK Interaktif · Landing Page

Etalase seluruh karya di [github.com/mykinteraktif](https://github.com/mykinteraktif): lab maya, game edukasi, dan contoh proyek web untuk siswa SMK.

## Fitur

- Kartu karya lengkap dengan thumbnail, mapel, kelas/fase, deskripsi, dan tag.
- Filter kategori (Lab Maya, Game Edukasi, Website & RPL), pencarian, dan urutan (terbaru, A–Z, unggulan).
- Tombol **Buka**, **Salin tautan** (untuk dibagikan ke grup kelas), dan **Kode sumber**.
- **Sinkron otomatis dengan GitHub**: repo publik baru langsung muncul sebagai kartu "Karya Baru" tanpa mengubah kode; tanggal pembaruan ikut diperbarui.
- Bagian **Profil Penyusun**: foto, biodata, portofolio singkat (dihitung otomatis), keahlian, dan tautan LinkedIn/Instagram/GitHub.
- **Video demo asli** tiap karya (`assets/video/*.mp4`, ±10 detik, total ±1,8 MB):
  - showreel otomatis di hero (karya unggulan),
  - pratinjau video saat kursor diarahkan ke kartu,
  - bagian **Video Demo** berisi pemutar dengan playlist dan putar otomatis.
- **Jendela demo interaktif** (klik gambar kartu): tab *Video demo*, *Coba langsung* (lab tertanam di halaman), dan *QR Code* untuk dipindai siswa. Navigasi ← → antar karya, Esc untuk menutup.
- Tombol **🎲 Coba Lab Acak**, filter per mapel, animasi muncul saat scroll, angka berjalan, efek kartu miring.
- Video latar otomatis berhenti saat tidak terlihat; animasi dimatikan bila perangkat meminta *reduced motion*.
- Mode terang/gelap, responsif untuk HP, tanpa build tool.

## Struktur

```
index.html          halaman utama
style.css           tampilan
script.js           logika (render, filter, sinkron GitHub)
data.js             daftar karya + biodata profil  ← edit di sini
assets/foto-profil.webp  foto profil (latar transparan)
assets/thumbs/      thumbnail tiap karya (640×400, .webp)
assets/video/       video demo tiap karya (640×400, .mp4)
assets/vendor/      qrcode.js (MIT, Kazuhiko Arase) untuk QR offline
```

## Menambah / merapikan karya baru

1. Buka `data.js`, salin satu blok `{ ... }` di dalam `PROYEK`, lalu isi `repo`, `judul`, `kategori`, `mapel`, `kelas`, `deskripsi`, dan `tag`.
2. Simpan screenshot karya sebagai `assets/thumbs/<nama-repo>.webp` (rasio 16:10) dan video demo singkat sebagai `assets/video/<nama-repo>.mp4` (16:10, tanpa suara, ±10 detik). Bisa direkam dengan perekam layar biasa lalu dikompres.
3. Commit dan push. Tanpa langkah ini pun repo baru tetap tampil otomatis, hanya dengan kartu sederhana.

## Mengubah biodata

Edit objek `PROFIL` di `data.js` (peran, bio, biodata, keahlian, bidang, sosial). Baris yang dikosongkan tidak ditampilkan. Ganti foto dengan menimpa `assets/foto-profil.webp` (rasio 4:5).

## Materi promosi (folder `promo/`)

- `status-1080x1920.png`: gambar status WA/IG/FB Story.
- `status-video-1080x1920.mp4`: video status 21 detik (6 cuplikan demo).
- `pratinjau-link-1200x630.jpg`: gambar pratinjau saat link dibagikan (juga dipakai sebagai `og:image`).
- `src/`: template HTML untuk merender ulang bila angka atau alamat berubah.

## Publikasi di GitHub Pages

1. Buka **Settings → Pages** di repo ini.
2. Pada **Source** pilih **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Situs akan tersedia di `https://mykinteraktif.github.io/landingpage/`.

> Ingin alamat utama `https://mykinteraktif.github.io/`? Ganti nama repo ini menjadi `mykinteraktif.github.io`.

---

Disusun oleh Mohammad Yusron Kholish, S.Kom · SMKS PGRI Singosari
