/* =========================================================
   DATA PROYEK — MYK Interaktif
   ---------------------------------------------------------
   Cara menambah proyek baru: salin satu blok { ... } lalu
   ubah isinya. Repo baru yang BELUM ada di daftar ini tetap
   tampil otomatis (diambil dari GitHub API) dengan kartu
   sederhana, jadi file ini cukup diisi untuk mempercantik.

   kategori : "lab"  = Lab Maya / Virtual Lab
              "game" = Game Edukasi
              "web"  = Contoh Website / Proyek RPL
              "alat" = Alat Bantu Guru (generator, aplikasi kerja)
   thumb    : file di folder assets/thumbs/
   ========================================================= */

const PROFIL = {
  nama: "Mohammad Yusron Kholish, S.Kom",
  sekolah: "SMKS PGRI Singosari",
  github: "mykinteraktif",

  /* ---- Biodata & portofolio (tampil di bagian "Profil") ----
     Baris yang dikosongkan ("") otomatis tidak ditampilkan. */
  foto: "assets/foto-profil.webp",
  peran: "Guru SMK · Pengembang Media Pembelajaran Interaktif",
  bio:
    "Pendidik di SMKS PGRI Singosari yang fokus mengubah materi praktik menjadi lab maya, simulasi, dan game edukasi berbasis web. Tujuannya sederhana: siswa bisa mencoba, salah, dan mengulang dengan aman, kapan saja, cukup dari browser HP atau laptop.",
  biodata: [
    ["Nama", "Mohammad Yusron Kholish, S.Kom"],
    ["Instansi", "SMKS PGRI Singosari, Kab. Malang"],
    ["Pendidikan", "S1 Ilmu Komputer (S.Kom) · Universitas Widyagama Malang"],
    ["Bidang", "Teknik Komputer & Jaringan, Media Pembelajaran Digital"],
    ["No. WA", "081532003456"],
    ["Email", "yusronkholish@gmail.com"],
  ],
  keahlian: [
    "Lab Maya / Virtual Lab",
    "Game Edukasi",
    "HTML · CSS · JavaScript",
    "Three.js (3D Web)",
    "Jaringan Komputer & MikroTik",
    "Cyber Security",
    "Desain Visual Pembelajaran",
    "Perangkat Ajar Kurikulum Merdeka",
  ],
  // Program keahlian / mapel yang sudah dibuatkan media
  bidang: [
    "TJKT", "Teknik Otomotif", "Teknik Ketenagalistrikan", "MPLB", "DKV", "RPL",
    "Geologi Pertambangan", "Matematika", "Sejarah", "Bahasa Inggris", "Bahasa Jawa", "PAI dan Budi Pekerti",
  ],
  sosial: {
    linkedin: "https://www.linkedin.com/in/mohammad-yusron-kholish-711801108/",
    instagram: "https://www.instagram.com/myusronk/",
    github: "https://github.com/mykinteraktif",
  },
};

const PROYEK = [
  {
    repo: "labmayafiberoptic",
    judul: "Fiber Optic Fault Finder",
    kategori: "lab",
    mapel: "TJKT",
    kelas: "Fase F",
    deskripsi:
      "Simulasi uji OTDR untuk mendeteksi kerusakan kabel fiber optik: ambil tiket gangguan, atur panjang gelombang, range, dan pulse width, jalankan tes, lalu baca trace untuk menemukan titik putus dan redaman.",
    tag: ["TKJ", "Fiber Optik", "OTDR"],
    unggulan: true,
  },
  {
    repo: "identifikasimineral",
    judul: "Identifikasi Mineral Berdasarkan Sifat Fisik",
    kategori: "lab",
    mapel: "Geologi Pertambangan",
    kelas: "Fase F (Kelas XI–XII)",
    deskripsi:
      "Jadi asisten geolog di laboratorium eksplorasi: amati warna dan kilap, lakukan uji cerat, kekerasan, dan kemagnetan untuk membuktikan identitas sampel magnetit, hematit, dan pirit.",
    tag: ["Geologi", "Mineral", "Skala Mohs"],
  },
  {
    repo: "jangkasorong",
    judul: "Pengukuran Jangka Sorong Otomotif",
    kategori: "game",
    mapel: "Dasar-dasar Teknik Otomotif",
    kelas: "Kelas X · Fase E",
    deskripsi:
      "Gim edukasi berlatar bengkel: kenali bagian jangka sorong, baca skala utama dan nonius, lalu ukur diameter luar, diameter dalam, dan kedalaman komponen otomotif lewat 4 misi bertingkat dengan XP dan bintang.",
    tag: ["Otomotif", "Pengukuran", "Gim"],
    unggulan: true,
  },
  {
    repo: "generatorstoryboard",
    judul: "Generator Rancangan Bahan Ajar",
    kategori: "alat",
    mapel: "Perangkat Ajar",
    kelas: "Untuk Guru",
    deskripsi:
      "Susun dokumen rancangan bahan ajar digital SMK: identitas, deskripsi, flowchart, rencana implementasi, dan storyboard. Bisa diisi otomatis dengan templat atau AI, lalu diunduh sebagai Word dan PDF.",
    tag: ["Alat Guru", "Storyboard", "Word & PDF"],
    unggulan: true,
  },
  {
    repo: "grammarquest",
    judul: "Grammar Quest",
    kategori: "game",
    mapel: "Bahasa Inggris",
    kelas: "Kelas X · Fase E",
    deskripsi:
      "Game petualangan belajar grammar: jelajahi 5 zona pulau, selesaikan misi, kumpulkan XP dan bintang, lalu taklukkan Final Exam.",
    tag: ["Game", "PWA", "Grammar"],
    unggulan: true,
  },
  {
    repo: "skantrirace",
    judul: "SKANTRI RACE",
    kategori: "game",
    mapel: "Game Sekolah",
    kelas: "Umum",
    deskripsi:
      "Game balap mobil 3D bergaya arcade: 4 mobil, 4 lintasan, nitro, item bonus, dan 5 lawan AI. Versi 1.2 menambah mode Multiplayer satu layar (layar terbagi) dan dua perangkat lewat kode ruang atau QR.",
    tag: ["3D", "Three.js", "Multiplayer"],
    thumb: "skantrirace.webp",
    unggulan: true,
  },
  {
    repo: "cybersecurity",
    judul: "Cyber Security Virtual Lab",
    kategori: "lab",
    mapel: "TJKT",
    kelas: "Kelas XI · Fase F",
    deskripsi:
      "Simulasi serangan dan pertahanan jaringan yang aman dan terkontrol, berjalan sepenuhnya di browser.",
    tag: ["TKJ", "Keamanan Jaringan"],
    unggulan: true,
  },
  {
    repo: "simulasimikrotik",
    judul: "Lab Maya MikroTik",
    kategori: "lab",
    mapel: "TJKT",
    kelas: "Kelas XI · Fase F",
    deskripsi:
      "Simulasi konfigurasi router MikroTik (RouterOS) lewat Winbox dan Terminal: gateway internet, bandwidth, firewall, hingga hotspot.",
    tag: ["TKJ", "RouterOS", "Winbox"],
  },
  {
    repo: "jaringandasar",
    judul: "Lab Maya Jaringan Dasar",
    kategori: "lab",
    mapel: "Dasar-dasar TJKT",
    kelas: "Kelas X · Fase E",
    deskripsi:
      "Kenali perangkat jaringan, praktik crimping kabel UTP, rakit topologi, dan uji koneksi dengan alamat IP dan ping.",
    tag: ["TKJ", "Crimping", "Topologi"],
  },
  {
    repo: "kendaraanringan4tak2tak",
    judul: "Lab Maya Otomotif: Mesin 2 Tak & 4 Tak",
    kategori: "lab",
    mapel: "Dasar-dasar Teknik Otomotif",
    kelas: "Kelas X · Fase E",
    deskripsi:
      "Putar, potong, dan jalankan mesin 3D langkah demi langkah untuk mengamati kerja piston, katup, dan saluran.",
    tag: ["Otomotif", "3D"],
    unggulan: true,
  },
  {
    repo: "bongkarpasangsepedamotor",
    judul: "Lab Maya Komponen Utama Motor Matik",
    kategori: "lab",
    mapel: "Teknik Sepeda Motor",
    kelas: "Kelas X · Fase E",
    deskripsi:
      "Kenali, rakit, dan uji 19 komponen utama sepeda motor matik secara interaktif.",
    tag: ["TSM", "Otomotif"],
  },
  {
    repo: "instalasipenerangansederhana",
    judul: "Lab Maya Instalasi Penerangan",
    kategori: "lab",
    mapel: "Teknik Ketenagalistrikan",
    kelas: "Kelas X–XI",
    deskripsi:
      "Simulasi instalasi penerangan rumah sederhana: rangkai saklar dan lampu, lalu uji hasilnya.",
    tag: ["Listrik", "Instalasi"],
  },
  {
    repo: "colorlab4d",
    judul: "Color Lab 4D",
    kategori: "lab",
    mapel: "Desain & Fotografi",
    kelas: "Kelas X–XI",
    deskripsi:
      "Laboratorium virtual teori warna, harmoni warna, dan penerapannya dalam fotografi.",
    tag: ["DKV", "Teori Warna"],
  },
  {
    repo: "LabMayaSimulasiSuratMasuk",
    judul: "Lab Maya Penanganan Surat Masuk",
    kategori: "lab",
    mapel: "MPLB",
    kelas: "Kelas X · Fase E",
    deskripsi:
      "Latihan prosedur penanganan surat masuk untuk Manajemen Perkantoran dan Layanan Bisnis.",
    tag: ["MPLB", "Administrasi"],
  },
  {
    repo: "labmayafungsigrafik",
    judul: "Lab Maya Fungsi & Grafik",
    kategori: "lab",
    mapel: "Matematika",
    kelas: "Kelas X · Fase E",
    deskripsi:
      "Eksperimen grafik fungsi kuadrat f(x) = ax² + bx + c secara realtime, dilengkapi eksperimen terpandu, tantangan, dan kuis.",
    tag: ["Matematika", "Grafik"],
  },
  {
    repo: "mrbuyung",
    judul: "Jejak Purba",
    kategori: "lab",
    mapel: "Sejarah",
    kelas: "Kelas X · Fase E",
    deskripsi:
      "Laboratorium maya interaktif untuk mempelajari sejarah manusia purba di Indonesia.",
    tag: ["Sejarah", "Manusia Purba"],
  },
  {
    repo: "tourmasjid",
    judul: "Masjid Digital",
    kategori: "lab",
    mapel: "PAI dan Budi Pekerti",
    kelas: "Kelas X · Fase E",
    deskripsi:
      "Jelajahi masjid 3D: lobby, perpustakaan, ruang wudu, salat, khutbah, muamalah, dan akhlak. Setiap ruangan berisi simulasi, poin, dan lencana.",
    tag: ["PAI", "3D"],
    unggulan: true,
  },
  {
    repo: "busanaadatjawa",
    judul: "Lab Maya Busana Adat Jawa",
    kategori: "lab",
    mapel: "Bahasa Jawa",
    kelas: "Kelas X–XI",
    deskripsi:
      "Media pembelajaran interaktif 3D untuk mengenal busana adat Jawa.",
    tag: ["Bahasa Jawa", "Budaya", "3D"],
  },
  {
    repo: "sosiologi",
    judul: "SosioLab",
    kategori: "lab",
    mapel: "Sosiologi",
    kelas: "Fase F",
    deskripsi:
      "Laboratorium maya sosiologi dengan delapan pos di peta, panduan, dan evaluasi bersertifikat.",
    tag: ["Sosiologi"],
    penyusun: "Ainur Rosyidah, S.Pd",
  },
  {
    repo: "testing",
    judul: "Seblak UMKM + Panel Admin",
    kategori: "web",
    mapel: "RPL",
    kelas: "Proyek Siswa",
    deskripsi:
      "Website profil UMKM satu halaman lengkap dengan panel admin dan database Firebase Cloud Firestore.",
    tag: ["RPL", "Firebase", "Vanilla JS"],
  },
  {
    repo: "contohwebsiteumkm",
    judul: "Dapur Kenanga",
    kategori: "web",
    mapel: "RPL",
    kelas: "Contoh Proyek",
    deskripsi:
      "Contoh website profil UMKM keripik rumahan dengan tombol pemesanan lewat WhatsApp.",
    tag: ["RPL", "UMKM"],
  },
  {
    repo: "seblakumkm",
    judul: "Dapur Kenanga (Varian)",
    kategori: "web",
    mapel: "RPL",
    kelas: "Contoh Proyek",
    deskripsi:
      "Varian contoh website profil UMKM Dapur Kenanga sebagai bahan latihan membuat landing page usaha.",
    tag: ["RPL", "UMKM"],
  },
];

/* Repo yang tidak perlu ditampilkan (mis. repo landing page ini). */
const ABAIKAN = ["landingpage", "mykinteraktif.github.io"];
