/* =========================================================
   MYK Interaktif — logika landing page
   1. Tampilkan data dari data.js (langsung, tanpa menunggu)
   2. Ambil daftar repo dari GitHub API → repo baru yang belum
      ada di data.js ikut tampil, tanggal update diperbarui
   3. Filter kategori, pencarian, urutan, salin tautan
   ========================================================= */
(() => {
  const USER = PROFIL.github;
  const KATEGORI = {
    semua: "Semua",
    lab: "Lab Maya",
    game: "Game Edukasi",
    web: "Website & RPL",
  };
  const CACHE_KEY = "myk-repos-v1";
  const CACHE_MS = 60 * 60 * 1000; // 1 jam

  const $ = (s) => document.querySelector(s);
  const grid = $("#grid");
  const state = { kat: "semua", q: "", sort: "baru" };

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
        <a class="card__media" href="${p.url}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">
          ${media}
          <span class="badge">${esc(KATEGORI[p.kategori] || "Proyek")}</span>
          ${p.unggulan ? '<span class="star">★ Unggulan</span>' : ""}
        </a>
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
    let list = items.filter((p) => state.kat === "semua" || p.kategori === state.kat);
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
    $("#stTotal").textContent = items.length;
    $("#stLab").textContent = items.filter((p) => p.kategori === "lab").length;
    $("#stMapel").textContent = new Set(items.filter((p) => p.kategori !== "web").map((p) => p.mapel)).size;
  }

  function renderHero() {
    const pilih = items.filter((p) => p.unggulan && p.thumb).slice(0, 3);
    $("#heroStack").innerHTML = pilih
      .map((p) => `<img src="assets/thumbs/${esc(p.thumb)}" alt="" width="640" height="400">`)
      .join("");
  }

  function renderAll() {
    renderChips();
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
          homepage: r.homepage, has_pages: r.has_pages, fork: r.fork, archived: r.archived, private: r.private,
        }));
        writeCache(repos);
      }

      const kenal = new Map(items.map((p) => [p.repo.toLowerCase(), p]));
      let baru = 0;
      for (const r of repos) {
        if (r.private || r.fork || ABAIKAN.includes(r.name)) continue;
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

  grid.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const url = b.dataset.copy;
    try {
      await navigator.clipboard.writeText(url);
    } catch (_) {
      const ta = Object.assign(document.createElement("textarea"), { value: url });
      document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    toast("Tautan disalin. Siap dibagikan ke siswa!");
  });

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

  renderHero();
  renderAll();
  sinkron();
})();
