// ===== Isi bagian ini dulu =====
const CONFIG = {
  nama: "Ariesta Vandera",
  nim: "2598030137",
  sekolah: "SMP Negeri 2 Semarang",
  // Tempel tautan video: YouTube (watch, youtu.be, atau embed) atau Google Drive (.../file/d/ID/view)
  videoUrl: "",
};
// ================================

// Isi data identitas ke semua elemen data-cfg
document.querySelectorAll("[data-cfg]").forEach((el) => {
  const v = CONFIG[el.dataset.cfg];
  if (v) el.textContent = v;
});

// Video: ubah tautan biasa menjadi tautan embed
function toEmbed(url) {
  let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (m) return "https://www.youtube.com/embed/" + m[1];
  m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (m) return "https://drive.google.com/file/d/" + m[1] + "/preview";
  return null;
}
const box = document.getElementById("videoBox");
if (CONFIG.videoUrl && box) {
  const src = toEmbed(CONFIG.videoUrl);
  if (src) {
    box.classList.add("ready");
    box.innerHTML = '<iframe src="' + src + '" title="Video pelaksanaan praktik mengajar" allowfullscreen loading="lazy"></iframe>';
  } else {
    box.querySelector("p").textContent = "Tautan video tidak dikenali. Gunakan tautan YouTube atau Google Drive.";
  }
}

// Menu di layar kecil
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Tandai menu sesuai bagian yang sedang dibaca
const links = [...nav.querySelectorAll("a")];
const byId = Object.fromEntries(links.map((a) => [a.getAttribute("href").slice(1), a]));
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      links.forEach((a) => { a.classList.remove("active"); a.removeAttribute("aria-current"); });
      const a = byId[en.target.id];
      if (a) { a.classList.add("active"); a.setAttribute("aria-current", "true"); }
    }
  });
}, { rootMargin: "-30% 0px -60% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));

// Bilah progres baca
const bar = document.getElementById("progress");
function onScroll() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Tema terang atau gelap
const root = document.documentElement;
const saved = localStorage.getItem("tema");
if (saved) root.dataset.theme = saved;
document.getElementById("themeBtn").addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  localStorage.setItem("tema", root.dataset.theme);
});

// Penghitung bagian yang belum diisi (hanya tampil saat dibuka lokal atau di GitHub Pages sebelum selesai)
const sisa = document.querySelectorAll(".isi").length;
const todo = document.getElementById("todo");
todo.textContent = sisa
  ? "Masih ada " + sisa + " bagian bertanda kuning yang belum diisi."
  : "Semua bagian sudah terisi.";
