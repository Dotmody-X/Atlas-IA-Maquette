// CURSOR
const CUR = document.getElementById("CUR");
let tx = 0,
  ty = 0,
  cx = 0,
  cy = 0;
document.addEventListener("mousemove", (e) => {
  tx = e.clientX;
  ty = e.clientY;
});
function ac() {
  cx += (tx - cx) * 0.16;
  cy += (ty - cy) * 0.16;
  CUR.style.transform = `translate(${cx}px,${cy}px)`;
  requestAnimationFrame(ac);
}
ac();
document.querySelectorAll("a,button,.v-card").forEach((el) => {
  el.addEventListener("mouseenter", () => document.body.classList.add("hov"));
  el.addEventListener("mouseleave", () =>
    document.body.classList.remove("hov"),
  );
});

// REVEAL
const obs = new IntersectionObserver(
  (e) =>
    e.forEach((el) => {
      if (el.isIntersecting) {
        el.target.classList.add("in");
        obs.unobserve(el.target);
      }
    }),
  { threshold: 0.07 },
);
document.querySelectorAll(".rev").forEach((el) => obs.observe(el));

// VERSIONS DATA
const VERSIONS = [
  {
    num: "V1",
    name: "Landing Classic",
    style: "Dark · Teal · Glassmorphism",
    path: "./V1/index.html",
    tag: "Dark",
    tagColor: "#0A9396",
    desc: "Premier proto — fond sombre teal, glassmorphisme, console animée.",
  },
  {
    num: "V2",
    name: "Proto Style — Ivory",
    style: "Ivory · Teal · Serif",
    path: "./V2/index.html",
    tag: "Light",
    tagColor: "#0A9396",
    desc: "Direction inspirée du proto existant — Instrument Serif, palette crème.",
  },
  {
    num: "V3",
    name: "Instrument Serif",
    style: "Ivory · Teal · Editorial",
    path: "./V3/index.html",
    tag: "Editorial",
    tagColor: "#94D2BD",
    desc: "Typographie Instrument Serif, mise en page bento structurée.",
  },
  {
    num: "V4",
    name: "Glass Apple",
    style: "Beige chaud · Orange · Glass",
    path: "./V4/index.html",
    tag: "Glass",
    tagColor: "#E9C46A",
    desc: "Glassmorphisme Vision Pro — ambre chaud, blur, coins arrondis.",
  },
  {
    num: "V5",
    name: "Gris Souris",
    style: "Gris souris · Bleu · Mono",
    path: "./V5/index.html",
    tag: "Grey",
    tagColor: "#0404e9",
    desc: "Palette gris chaud, bento grid, typographie Syne + DM Mono.",
  },
  {
    num: "V6",
    name: "3D Objects + Orange",
    style: "Gris · Orange · 3D CSS",
    path: "./V6/index.html",
    tag: "3D",
    tagColor: "#f06400",
    desc: "Objets 3D CSS flottants, touches de clavier interactives, curseur custom.",
  },
  {
    num: "V7",
    name: "Dark Tech Bebas",
    style: "Noir · Orange · Bebas Neue",
    path: "./V7/index.html",
    tag: "Dark",
    tagColor: "#f06400",
    desc: "Bebas Neue massive, watermark géant, objets 3D avec parallaxe souris.",
  },
  {
    num: "V8",
    name: "Editorial Doux",
    style: "Crème · Coral · Cormorant",
    path: "./V8/index.html",
    tag: "Soft",
    tagColor: "#d45a3a",
    desc: "Cormorant Garamond italic, Caveat script, collage polaroids, ambiance organique.",
  },
];

// BUILD GRID
const VG = document.getElementById("VG");
VERSIONS.forEach((v, i) => {
  const card = document.createElement("div");
  card.className = "v-card rev";
  card.style.transitionDelay = `${i * 0.05}s`;
  card.innerHTML = `
    <div class="v-preview">
      <div class="v-iframe-wrap" id="wrap-${i}">
        <iframe src="${v.path}" loading="lazy" title="${v.name}" scrolling="no"></iframe>
      </div>
      <div class="v-overlay">
        <button class="v-open-btn" onclick="openModal('${v.path}','${v.num}','${v.name}')">
          Ouvrir en plein écran →
        </button>
      </div>
    </div>
    <div class="v-card-footer">
      <div class="v-num">${v.num}</div>
      <div class="v-info">
        <span class="v-name">${v.name}</span>
      </div>
      <div class="v-style">${v.style}</div>
      <div class="v-tag" style="background:${v.tagColor}22;color:${v.tagColor};border:1px solid ${v.tagColor}44">${v.tag}</div>
    </div>
  `;
  card.addEventListener("click", (e) => {
    if (!e.target.closest(".v-open-btn")) openModal(v.path, v.num, v.name);
  });
  VG.appendChild(card);
  obs.observe(card);
});

// Scale iframes to fit preview
function scaleIframes() {
  document.querySelectorAll(".v-iframe-wrap").forEach((wrap) => {
    const w = wrap.offsetWidth;
    const h = wrap.offsetHeight;
    const scale = Math.min(w / 1440, h / 900);
    const iframe = wrap.querySelector("iframe");
    if (iframe) {
      iframe.style.transform = `scale(${scale})`;
      iframe.style.width = "1440px";
      iframe.style.height = "900px";
    }
  });
}
window.addEventListener("resize", scaleIframes);
setTimeout(scaleIframes, 500);

// MODAL
function openModal(path, num, name) {
  const modal = document.getElementById("MODAL");
  const frame = document.getElementById("MODAL-FRAME");
  const title = document.getElementById("MODAL-TITLE");
  const link = document.getElementById("MODAL-LINK");
  frame.src = path;
  title.innerHTML = `${num} · <span>${name}</span>`;
  link.href = path;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  const modal = document.getElementById("MODAL");
  const frame = document.getElementById("MODAL-FRAME");
  modal.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => {
    frame.src = "about:blank";
  }, 300);
}
document.getElementById("MODAL").addEventListener("click", (e) => {
  if (e.target === document.getElementById("MODAL")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
