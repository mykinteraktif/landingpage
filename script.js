/* =========================================================
   MYK Interaktif — logika landing page
   1. Tampilkan data dari data.js (langsung, tanpa menunggu)
   2. Ambil daftar repo dari GitHub API → repo baru yang belum
      ada di data.js ikut tampil, tanggal update diperbarui
   3. Filter kategori, mapel, pencarian, urutan, salin tautan
   4. Interaksi: video pratinjau, modal demo (video / coba
      langsung / QR), showreel hero, teater video, animasi
   ========================================================= */
(() => {
  const USER = PROFIL.github;
  const KATEGORI = {
    semua: "Semua",
    lab: "Lab Maya",
    game: "Game Edukasi",
    web: "Website & RPL",
  };
  const CACHE_KEY = "myk-repos-v2";
  const CACHE_MS = 60 * 60 * 1000; // 1 jam

  const $ = (s) => document.querySelector(s);
  const grid = $("#grid");
  const state = { kat: "semua", q: "", sort: "baru", mapel: "" };
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Tanggal cadangan (dipakai bila GitHub API tidak bisa diakses)
  const TANGGAL_AWAL = {
    grammarquest: "2026-10-26", skantrirace: "2026-10-21", testing: "2026-10-26",
    jaringandasar: "2026-10-19", colorlab4d: "2026-10-16", instalasipenerangansederhana: "2026-10-16",
    busanaadatjawa: "2026-10-16", kendaraanringan4tak2tak: "2026-10-15", seblakumkm: "2026-10-14",
    contohwebsiteumkm: "2026-10-13", cybersecurity: "2026-10-09", bongkarpasangsepedamotor: "2026-10-06",
    tourmasjid: "2026-10-05", labmayafungsigrafik: "2026-10-05", mrbuyung: "2026-10-05",
    simulasimikrotik: "2026-10-05", sosiologi: "2026-10-03", LabMayaSimulasiSuratMasuk: "2026-10-03",
  };

  let items = PROYEK.map((p) => ({
    ...p,
    thumb: p.thumb ?? `${p.repo}.webp`,
    video: p.video ?? `${p.repo}.mp4`,
    update: TANGGAL_AWAL[p.repo] || null,
    url: `https://${USER}.github.io/${p.repo}/`,
    kode: `https://github.com/${USER}/${p.repo}`,
  }));

  /* ---------- util ---------- */
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const fmtTanggal = (iso) =>
    iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "";

  // "labmayafungsigrafik" / "Lab-Maya_X" → judul yang lebih rapi untuk repo baru
  const rapikanNama = (n) =>
    n.replace(/[-_]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase());

  const inisial = (judul) =>
    judul.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- render ---------- */
  function kartu(p) {
    const media = p.thumb
      ? `<img src="assets/thumbs/${esc(p.thumb)}" alt="Tampilan ${esc(p.judul)}" loading="lazy" width="640" height="400"
           onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'card__ph',textContent:'${esc(inisial(p.judul))}'}))">`
      : `<div class="card__ph">${esc(inisial(p.judul))}</div>`;
    const tags = (p.tag || []).map((t) => `<li>${esc(t)}</li>`).join("");
    return `
      <article class="card" data-kat="${esc(p.kategori)}">
        <button class="card__media" type="button" data-demo="${esc(p.repo)}" aria-label="Lihat demo ${esc(p.judul)}">
          ${media}
          ${p.video ? `<video muted loop playsinline preload="none" data-src="assets/video/${esc(p.video)}"></video>` : ""}
          <span class="badge">${esc(KATEGORI[p.kategori] || "Proyek")}</span>
          ${p.unggulan ? '<span class="star">★ Unggulan</span>' : ""}
          <span class="card__play" aria-hidden="true">${p.video ? "▶ Lihat demo" : "🖱 Coba langsung"}</span>
        </button>
        <div class="card__body">
          <div class="card__meta">
            ${p.mapel ? `<b>${esc(p.mapel)}</b>` : ""}
            ${p.kelas ? `<span>${esc(p.kelas)}</span>` : ""}
            ${p.update ? `<span>Diperbarui ${fmtTanggal(p.update)}</span>` : ""}
          </div>
          <h3>${esc(p.judul)}</h3>
          <p>${esc(p.deskripsi || "Proyek terbaru dari repositori GitHub.")}</p>
          ${tags ? `<ul class="tags">${tags}</ul>` : ""}
          ${p.penyusun ? `<span class="card__by">Penyusun: ${esc(p.penyusun)}</span>` : ""}
        </div>
        <div class="card__foot">
          <a class="btn btn--primary" href="${p.url}" target="_blank" rel="noopener">Buka ${p.kategori === "game" ? "Game" : p.kategori === "web" ? "Website" : "Lab"} ↗</a>
          <button class="icon-btn" type="button" data-copy="${p.url}" aria-label="Salin tautan ${esc(p.judul)}" title="Salin tautan">
            <svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
          </button>
          <a class="icon-btn" href="${p.kode}" target="_blank" rel="noopener" aria-label="Kode sumber ${esc(p.judul)} di GitHub" title="Kode sumber">
            <svg viewBox="0 0 24 24" class="gh"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/></svg>
          </a>
        </div>
      </article>`;
  }

  function render() {
    const q = state.q.trim().toLowerCase();
    let list = items.filter(
      (p) => (state.kat === "semua" || p.kategori === state.kat) && (!state.mapel || p.mapel === state.mapel)
    );
    if (q) {
      list = list.filter((p) =>
        [p.judul, p.mapel, p.kelas, p.deskripsi, p.repo, ...(p.tag || [])].join(" ").toLowerCase().includes(q)
      );
    }
    const byDate = (a, b) => (b.update || "").localeCompare(a.update || "");
    if (state.sort === "az") list.sort((a, b) => a.judul.localeCompare(b.judul, "id"));
    else if (state.sort === "unggulan") list.sort((a, b) => (b.unggulan ? 1 : 0) - (a.unggulan ? 1 : 0) || byDate(a, b));
    else list.sort(byDate);

    grid.innerHTML = list.map(kartu).join("");
    $("#empty").hidden = list.length > 0;
    tampil = list;
  }

  // urutan kartu yang sedang tampil (untuk tombol sebelumnya/berikutnya di modal)
  let tampil = [];

  function renderMapel() {
    const sel = $("#mapel");
    const daftar = [...new Set(items.map((p) => p.mapel).filter(Boolean))].sort((a, b) => a.localeCompare(b, "id"));
    sel.innerHTML =
      '<option value="">Semua mapel</option>' +
      daftar.map((m) => `<option ${m === state.mapel ? "selected" : ""}>${esc(m)}</option>`).join("");
  }

  function renderChips() {
    const count = (k) => (k === "semua" ? items.length : items.filter((p) => p.kategori === k).length);
    $("#chips").innerHTML = Object.entries(KATEGORI)
      .filter(([k]) => count(k) > 0)
      .map(
        ([k, label]) =>
          `<button class="chip" role="tab" type="button" data-kat="${k}" aria-selected="${state.kat === k}">${label}<span>${count(k)}</span></button>`
      )
      .join("");
  }

  function renderStats() {
    hitung($("#stTotal"), items.length);
    hitung($("#stLab"), items.filter((p) => p.kategori === "lab").length);
    hitung($("#stMapel"), new Set(items.filter((p) => p.kategori !== "web").map((p) => p.mapel)).size);
  }


  const IKON = {
    linkedin: ["LinkedIn", '<path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.5V9h3.6v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"/>'],
    instagram: ["Instagram", '<path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z"/>'],
    whatsapp: ["WhatsApp", '<path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 0 1 12 2.2a9.8 9.8 0 0 1 0 19.6zM12 0a11.9 11.9 0 0 0-10.2 18L0 24l6.2-1.6A11.9 11.9 0 1 0 12 0z"/>'],
    email: ["Email", '<path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 7 9 6 9-6" fill="none" stroke="currentColor" stroke-width="2"/>'],
    github: ["GitHub", '<path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/>'],
  };

  /* ---------- kontak ---------- */
  const K = PROFIL.kontak || {};
  // "0815..." → "62815..." untuk wa.me
  const nomorWa = (n) => String(n).replace(/\D/g, "").replace(/^0/, "62");
  const formatWa = (n) => String(n).replace(/\D/g, "").replace(/^(\d{4})(\d{4})(\d+)$/, "$1-$2-$3");
  const linkWa = () => `https://wa.me/${nomorWa(K.wa)}?text=${encodeURIComponent(K.pesanWa || "")}`;
  const linkMail = () =>
    `mailto:${K.email}?subject=${encodeURIComponent("Tentang MYK Interaktif")}`;

  function renderProfil() {
    const P = PROFIL;
    $("#pfNama").textContent = P.nama;
    $("#pfPeran").textContent = P.peran || "";
    $("#pfBio").textContent = P.bio || "";
    if (P.foto) $("#pfFoto").src = P.foto;

    $("#pfBiodata").innerHTML = (P.biodata || [])
      .filter(([, v]) => v)
      .map(([k, v]) => {
        const href = k === "WhatsApp" ? linkWa() : k === "Email" ? linkMail() : "";
        return `<dt>${esc(k)}</dt><dd>${href ? `<a href="${esc(href)}" ${k === "WhatsApp" ? 'target="_blank" rel="noopener"' : ""}>${esc(v)}</a>` : esc(v)}</dd>`;
      })
      .join("");

    // tombol kontak di kartu foto
    $("#pfKontak").innerHTML = [
      K.wa && `<a class="pc pc--wa" href="${esc(linkWa())}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true">${IKON.whatsapp[1]}</svg>Chat WhatsApp</a>`,
      K.email && `<a class="pc" href="${esc(linkMail())}"><svg viewBox="0 0 24 24" aria-hidden="true">${IKON.email[1]}</svg>Kirim Email</a>`,
    ].filter(Boolean).join("");

    // bagian Kontak, footer, tombol melayang
    const waPath = IKON.whatsapp[1].match(/d="([^"]+)"/)[1];
    ["#icWa", "#icWa2"].forEach((s) => $(s).setAttribute("d", waPath));
    if (K.wa) {
      ["#ktWa", "#ftWa", "#waFloat"].forEach((s) => ($(s).href = linkWa()));
      $("#ktWaNo").textContent = formatWa(K.wa);
    } else {
      ["#ktWa", "#ftWa", "#waFloat"].forEach((s) => $(s).remove());
    }
    if (K.email) {
      ["#ktMail", "#ftMail"].forEach((s) => ($(s).href = linkMail()));
      $("#ktMailTxt").textContent = K.email;
      $("#ktMailCopy").addEventListener("click", () => salinTeks(K.email, "Alamat email disalin."));
    } else {
      $("#ktMail").parentElement.remove();
      $("#ftMail").remove();
    }

    $("#pfSosial").innerHTML = Object.entries(P.sosial || {})
      .filter(([k, url]) => url && IKON[k])
      .map(([k, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${IKON[k][0]}">
          <svg viewBox="0 0 24 24" aria-hidden="true">${IKON[k][1]}</svg>${IKON[k][0]}</a>`)
      .join("");

    $("#pfKeahlian").innerHTML = (P.keahlian || []).map((t) => `<li>${esc(t)}</li>`).join("");
    $("#pfBidang").innerHTML = (P.bidang || []).map((t) => `<li>${esc(t)}</li>`).join("");
  }

  // Angka portofolio: hanya karya yang disusun sendiri (tanpa field "penyusun")
  function renderPstats() {
    const milik = items.filter((p) => !p.penyusun);
    const n = (k) => milik.filter((p) => p.kategori === k).length;
    const data = [
      [milik.length, "Karya dipublikasikan"],
      [n("lab"), "Lab maya"],
      [n("game"), "Game edukasi"],
      [(PROFIL.bidang || []).length, "Program & mapel"],
    ];
    $("#pfStats").innerHTML = data.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("");
  }

  function renderAll() {
    renderPstats();
    renderChips();
    renderMapel();
    renderStats();
    render();
  }

  /* ---------- sinkron GitHub ---------- */
  function readCache() {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (c && Date.now() - c.t < CACHE_MS) return c.data;
    } catch (_) {}
    return null;
  }
  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data })); } catch (_) {}
  }

  async function sinkron() {
    const info = $("#syncInfo");
    try {
      let repos = readCache();
      if (!repos) {
        const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) throw new Error(res.status);
        repos = (await res.json()).map((r) => ({
          name: r.name, description: r.description, pushed_at: r.pushed_at,
          homepage: r.homepage, has_pages: r.has_pages, fork: r.fork, archived: r.archived, private: r.private, size: r.size,
        }));
        writeCache(repos);
      }

      const kenal = new Map(items.map((p) => [p.repo.toLowerCase(), p]));
      let baru = 0;
      for (const r of repos) {
        if (r.private || r.fork || ABAIKAN.includes(r.name)) continue;
        if (r.size === 0) continue; // repo masih kosong: tunggu sampai ada isinya
        const ada = kenal.get(r.name.toLowerCase());
        if (ada) {
          ada.update = r.pushed_at;
          continue;
        }
        baru++;
        items.push({
          repo: r.name,
          judul: rapikanNama(r.name),
          kategori: "lab",
          mapel: "Karya Baru",
          kelas: "",
          deskripsi: r.description || "Karya terbaru, deskripsi menyusul.",
          tag: ["Baru"],
          thumb: null,
          video: null,
          update: r.pushed_at,
          url: r.homepage || `https://${USER}.github.io/${r.name}/`,
          kode: `https://github.com/${USER}/${r.name}`,
        });
      }
      renderAll();
      info.textContent = baru
        ? `Tersinkron dengan GitHub · ${baru} karya baru terdeteksi`
        : "Tersinkron dengan GitHub";
    } catch (e) {
      info.textContent = "Menampilkan daftar tersimpan (GitHub sedang tidak dapat diakses)";
    }
  }

  /* ---------- event ---------- */
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    state.kat = b.dataset.kat;
    renderChips();
    render();
  });

  let t;
  $("#q").addEventListener("input", (e) => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = e.target.value; render(); }, 120);
  });

  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("#mapel").addEventListener("change", (e) => { state.mapel = e.target.value; render(); });

  async function salinTeks(teks, pesan) {
    try {
      await navigator.clipboard.writeText(teks);
    } catch (_) {
      const ta = Object.assign(document.createElement("textarea"), { value: teks });
      document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    toast(pesan);
  }
  const salin = (url) => salinTeks(url, "Tautan disalin. Siap dibagikan ke siswa!");

  grid.addEventListener("click", (e) => {
    const c = e.target.closest("[data-copy]");
    if (c) return salin(c.dataset.copy);
    const d = e.target.closest("[data-demo]");
    if (d) bukaDemo(d.dataset.demo);
  });

  /* ---------- video pratinjau saat kursor di atas kartu ---------- */
  if (finePointer) {
    grid.addEventListener("mouseover", (e) => {
      const m = e.target.closest(".card__media");
      const v = m && m.querySelector("video");
      if (!v || m.contains(e.relatedTarget)) return;
      if (!v.src) v.src = v.dataset.src;
      v.currentTime = 0;
      v.play().then(() => m.classList.add("is-playing")).catch(() => {});
    });
    grid.addEventListener("mouseout", (e) => {
      const m = e.target.closest(".card__media");
      const v = m && m.querySelector("video");
      if (!v || m.contains(e.relatedTarget)) return;
      v.pause();
      m.classList.remove("is-playing");
    });
  }

  /* ---------- efek kartu miring mengikuti kursor ---------- */
  if (finePointer && !reduceMotion) {
    grid.addEventListener("pointermove", (e) => {
      const c = e.target.closest(".card");
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    grid.addEventListener("pointerout", (e) => {
      const c = e.target.closest(".card");
      if (c && !c.contains(e.relatedTarget)) c.style.transform = "";
    });
  }

  /* ---------- modal demo ---------- */
  const modal = $("#modal");
  const mVideo = $("#mVideo");
  const mFrame = $("#mFrame");
  let aktif = null;

  function cari(repo) {
    return items.find((p) => p.repo === repo);
  }

  function pilihTab(tab) {
    if (tab === "qr" && !window.qrcode) tab = "video";
    if (tab === "video" && !aktif.video) tab = "live";
    modal.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", b.dataset.tab === tab));
    modal.querySelectorAll("[data-pane]").forEach((el) => (el.hidden = el.dataset.pane !== tab));
    $("#mNoVideo").hidden = true;
    if (tab === "video") {
      mVideo.play().catch(() => {});
    } else {
      mVideo.pause();
    }
    if (tab === "live" && mFrame.dataset.src !== aktif.url) {
      mFrame.src = mFrame.dataset.src = aktif.url;
    }
    if (tab === "qr") {
      const qr = qrcode(0, "M");
      qr.addData(aktif.url);
      qr.make();
      $("#mQr").innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
    }
  }

  function isiModal(p, tab) {
    const tabSekarang = modal.querySelector('[data-tab][aria-selected="true"]').dataset.tab;
    aktif = p;
    $("#mJudul").textContent = p.judul;
    $("#mMeta").textContent = [KATEGORI[p.kategori], p.mapel, p.kelas].filter(Boolean).join(" · ");
    $("#mDesk").textContent = p.deskripsi || "";
    $("#mOpen").href = p.url;
    $("#mUrl").textContent = p.url;
    mFrame.removeAttribute("src");
    delete mFrame.dataset.src;
    if (p.video) {
      mVideo.src = `assets/video/${p.video}`;
      mVideo.poster = p.thumb ? `assets/thumbs/${p.thumb}` : "";
    } else {
      mVideo.removeAttribute("src");
    }
    pilihTab(tab || tabSekarang);
  }

  function bukaDemo(repo, tab) {
    const p = cari(repo);
    if (!p) return;
    pauseLatar();
    if (!modal.open) modal.showModal();
    isiModal(p, tab || "video");
  }

  function geser(arah) {
    const daftar = tampil.length ? tampil : items;
    const i = daftar.findIndex((p) => p.repo === aktif.repo);
    isiModal(daftar[(i + arah + daftar.length) % daftar.length]);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) modal.close();
    const t = e.target.closest("[data-tab]");
    if (t) pilihTab(t.dataset.tab);
  });
  modal.addEventListener("close", () => {
    mVideo.pause();
    mFrame.removeAttribute("src"); // hentikan suara lab
    delete mFrame.dataset.src;
    lanjutLatar();
  });
  modal.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea")) return;
    if (e.key === "ArrowRight") geser(1);
    if (e.key === "ArrowLeft") geser(-1);
  });
  $("#mPrev").addEventListener("click", () => geser(-1));
  $("#mNext").addEventListener("click", () => geser(1));
  $("#mCopy").addEventListener("click", () => salin(aktif.url));

  $("#btnAcak").addEventListener("click", () => {
    const pool = items.filter((p) => p.kategori !== "web");
    bukaDemo(pool[Math.floor(Math.random() * pool.length)].repo);
  });

  /* ---------- showreel hero ---------- */
  const reelVideo = $("#reelVideo");
  const reelList = () => items.filter((p) => p.unggulan && p.video);
  let reelIdx = 0;

  function putarReel(i) {
    const list = reelList();
    if (!list.length) return;
    reelIdx = (i + list.length) % list.length;
    const p = list[reelIdx];
    reelVideo.src = `assets/video/${p.video}`;
    reelVideo.poster = p.thumb ? `assets/thumbs/${p.thumb}` : "";
    $("#reelJudul").textContent = p.judul;
    $("#reelKat").textContent = [KATEGORI[p.kategori], p.mapel].filter(Boolean).join(" · ");
    $("#reelUrl").textContent = `${USER}.github.io/${p.repo}`;
    $("#reelDots").querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-selected", j === reelIdx));
    if (!reduceMotion) reelVideo.play().catch(() => {});
  }

  function siapkanReel() {
    $("#reelDots").innerHTML = reelList()
      .map((p, j) => `<button type="button" role="tab" aria-label="${esc(p.judul)}" data-i="${j}"></button>`)
      .join("");
    putarReel(0);
  }

  reelVideo.addEventListener("ended", () => putarReel(reelIdx + 1));
  reelVideo.addEventListener("timeupdate", () => {
    if (reelVideo.duration) $("#reelProg").style.width = `${(reelVideo.currentTime / reelVideo.duration) * 100}%`;
  });
  $("#reelDots").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) putarReel(+b.dataset.i);
  });
  $("#reelOpen").addEventListener("click", () => bukaDemo(reelList()[reelIdx].repo));

  /* ---------- teater video ---------- */
  const thVideo = $("#thVideo");
  const thList = () => items.filter((p) => p.video);
  let thIdx = 0;

  function renderPlaylist() {
    $("#playlist").innerHTML = thList()
      .map(
        (p, j) => `<li><button type="button" data-i="${j}" aria-current="${j === thIdx}">
          <img src="assets/thumbs/${esc(p.thumb)}" alt="" loading="lazy" width="96" height="60">
          <span><b>${esc(p.judul)}</b><small>${esc(p.mapel || "")}</small></span>
        </button></li>`
      )
      .join("");
  }

  function putarTeater(i, mulai) {
    const list = thList();
    thIdx = (i + list.length) % list.length;
    const p = list[thIdx];
    thVideo.src = `assets/video/${p.video}`;
    thVideo.poster = p.thumb ? `assets/thumbs/${p.thumb}` : "";
    $("#thJudul").textContent = p.judul;
    $("#thMeta").textContent = [KATEGORI[p.kategori], p.mapel, p.kelas].filter(Boolean).join(" · ");
    $("#thDesk").textContent = p.deskripsi || "";
    $("#playlist").querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", j === thIdx));
    const li = $("#playlist").children[thIdx];
    if (li && mulai) li.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    if (mulai) thVideo.play().catch(() => {});
  }

  $("#playlist").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) putarTeater(+b.dataset.i, true);
  });
  thVideo.addEventListener("ended", () => {
    if ($("#thAuto").checked) putarTeater(thIdx + 1, true);
  });
  $("#thCoba").addEventListener("click", () => bukaDemo(thList()[thIdx].repo, "live"));

  // video latar berhenti saat modal terbuka / tidak terlihat (hemat kuota & baterai)
  let teaterJalan = false;
  function pauseLatar() {
    teaterJalan = !thVideo.paused;
    reelVideo.pause();
    thVideo.pause();
  }
  function lanjutLatar() {
    if (!reduceMotion && reelTerlihat) reelVideo.play().catch(() => {});
    if (teaterJalan) thVideo.play().catch(() => {});
  }
  let reelTerlihat = true;
  new IntersectionObserver(([en]) => {
    reelTerlihat = en.isIntersecting;
    if (reelTerlihat && !modal.open && !reduceMotion) reelVideo.play().catch(() => {});
    else reelVideo.pause();
  }).observe($("#reel"));
  new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) thVideo.pause();
  }).observe(thVideo);

  /* ---------- animasi muncul saat scroll & angka berjalan ---------- */
  const io = new IntersectionObserver(
    (ens) =>
      ens.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  function hitung(el, target) {
    if (reduceMotion) return (el.textContent = target);
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 900);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Tema terang/gelap (disimpan di perangkat pengunjung)
  const root = document.documentElement;
  try { const s = localStorage.getItem("myk-theme"); if (s) root.dataset.theme = s; } catch (_) {}
  $("#themeBtn").addEventListener("click", () => {
    const gelapSekarang = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = gelapSekarang ? "light" : "dark";
    try { localStorage.setItem("myk-theme", root.dataset.theme); } catch (_) {}
  });

  $("#yr").textContent = new Date().getFullYear();

  renderProfil();
  renderAll();
  siapkanReel();
  renderPlaylist();
  putarTeater(0, false);
  sinkron();
})();
