// REVEAL
const obs = new IntersectionObserver(e => e.forEach(el => {
  if (el.isIntersecting) { el.target.classList.add('in'); obs.unobserve(el.target); }
}), { threshold: .07 });
document.querySelectorAll('.rev').forEach(el => obs.observe(el));

// FAQ
const faqs = [
  ["Mes données sont-elles vraiment privées ?", "Absolument. Le serveur est physiquement chez vous. Les modèles IA tournent en local, sans connexion internet requise. Vos données ne quittent jamais votre réseau."],
  ["Que se passe-t-il si le serveur tombe ?", "L'agent Watchdog surveille en permanence et redémarre automatiquement. En cas d'incident majeur, notre équipe intervient sous 4h (Business Pro)."],
  ["Est-ce difficile à utiliser ?", "Non. La formation 2 à 4h incluse suffit pour être pleinement autonome. Interface pensée pour les non-techniciens."],
  ["Puis-je ajouter des agents plus tard ?", "Oui, à tout moment. Les agents s'installent comme des modules indépendants."],
  ["Quelle différence avec ChatGPT ?", "ChatGPT envoie vos données à OpenAI et coûte un abonnement mensuel. Atlas-IA tourne 100% en local et vous appartient."],
  ["Y a-t-il un abonnement obligatoire ?", "Non. Prix unique : hardware, installation et 6 mois de support. Support continu optionnel après 6 mois."],
  ["Puis-je avoir Claude d'Anthropic ?", "Oui. Option +299€ setup. Vous créez votre propre compte Anthropic — contrôle total des coûts et données."],
  ["Zones de livraison ?", "Belgique, France, Luxembourg, Pays-Bas et Suisse. Installation sur site incluse."],
];
const FG = document.getElementById('FG');
faqs.forEach(([q, a]) => {
  const d = document.createElement('div'); d.className = 'fc';
  d.innerHTML = `<button class="fq">${q}<i class="fa-solid fa-plus"></i></button><div class="fa"><p>${a}</p></div>`;
  d.querySelector('.fq').onclick = () => {
    const o = d.classList.contains('open');
    document.querySelectorAll('.fc.open').forEach(i => i.classList.remove('open'));
    if (!o) d.classList.add('open');
  };
  FG.appendChild(d);
});

// PRICING
let cg = 'pme';
const D = {
  solo: { h: { name:'Hobby', tier:'Solo / Particulier', hw:'Raspberry Pi 5 · RAM & SSD configurables', base:799, feat:false, feats:["1 agent IA local (Phi / Mistral 7B)","~50 tokens / sec","Installation 24-48h","Formation 1h","Support 3 mois","1 canal d'intégration"], ram:[{l:'8 GB',d:0},{l:'16 GB',d:80}], ssd:[{l:'256 GB',d:0},{l:'512 GB',d:40},{l:'1 TB',d:80},{l:'2 TB',d:140}], cl:false, sub:"Support continu optionnel : 99 €/mois" } },
  pme: {
    h: { name:'Hobby', tier:'PME débutante', hw:'Raspberry Pi 5 · RAM & SSD configurables', base:1299, feat:false, feats:["1 agent IA local (Mistral 7B)","~50 tok/sec","Installation 24-48h","Formation 2h","Support 6 mois","1 canal d'intégration"], ram:[{l:'8 GB',d:0},{l:'16 GB',d:80}], ssd:[{l:'256 GB',d:0},{l:'512 GB',d:40},{l:'1 TB',d:80},{l:'2 TB',d:140}], cl:true, sub:"Support continu : 99 €/mois" },
    b: { name:'Business', tier:'PME · Recommandé', hw:'Raspberry Pi 5 16GB + SSD configurable', base:1799, feat:true, feats:["Jusqu'à 3 agents spécialisés (au choix)","Mistral 7B · ~50 tok/sec","Installation sur site 24-48h","Formation 3h + documentation","Support 6 mois prioritaire","Dashboard Pro + Jarvis app","Jusqu'à 3 canaux d'intégration"], ram:[{l:'16 GB (inclus)',d:0}], ssd:[{l:'1 TB',d:0},{l:'2 TB',d:80},{l:'4 TB',d:200}], cl:true, sub:"Support continu : 150 €/mois" },
    p: { name:'Business Pro', tier:'PME haute performance', hw:'i7 + RTX 4070 + 32GB RAM + SSD', base:3999, feat:false, feats:["Jusqu'à 5 agents spécialisés (au choix)","Mistral 70B / Llama 3 70B · 100+ tok/sec","Installation sur site 48-72h","Formation 4h + documentation","Support 6 mois (4h intervention)","Dashboard Pro + API + Jarvis","RAG sur vos données propriétaires","Intégrations illimitées"], ram:[{l:'32 GB (inclus)',d:0}], ssd:[{l:'1 TB',d:0},{l:'2 TB',d:100},{l:'4 TB RAID',d:280},{l:'8 TB RAID',d:520}], cl:true, sub:"Support continu : 200 €/mois" }
  }
};
function calcT(id) {
  const c = document.getElementById(id); if (!c) return;
  const d = c._d;
  const ri = +(c.querySelector('[data-t="r"]')?.value || 0);
  const si = +(c.querySelector('[data-t="s"]')?.value || 0);
  const cl = c.querySelector('.co-box')?.classList.contains('on') || false;
  const t = d.base + (d.ram[ri]?.d || 0) + (d.ssd[si]?.d || 0) + (cl ? 299 : 0);
  const el = c.querySelector('.ttv'); if (el) el.textContent = t.toLocaleString('fr-BE') + ' €';
}
function renderP(g) {
  const grid = document.getElementById('PG');
  const tiers = D[g]; const keys = Object.keys(tiers);
  grid.style.gridTemplateColumns = `repeat(${keys.length}, 1fr)`;
  grid.innerHTML = '';
  keys.forEach(k => {
    const d = tiers[k]; const id = 'T' + k;
    const div = document.createElement('div');
    div.className = 'tier' + (d.feat ? ' feat' : '');
    div._d = d; div.id = id;
    div.setAttribute('data-nm', d.name);
    div.innerHTML = `
      <span class="tier-n">${d.tier}</span>
      <div class="tier-price">${d.base.toLocaleString('fr-BE')} €</div>
      <span class="tier-from">à partir de · achat unique</span>
      <div class="tier-hw">${d.hw}</div>
      <div class="tier-cfg">
        ${d.ram.length > 1 ? `<div class="cfg-r"><span class="cfg-l">RAM</span><select class="cfg-s" data-t="r" onchange="calcT('${id}')">
          ${d.ram.map((o,i) => `<option value="${i}">${o.l}${o.d ? ' (+' + o.d + ' €)' : ''}</option>`).join('')}
        </select></div>` : ''}
        <div class="cfg-r"><span class="cfg-l">SSD</span><select class="cfg-s" data-t="s" onchange="calcT('${id}')">
          ${d.ssd.map((o,i) => `<option value="${i}">${o.l}${o.d ? ' (+' + o.d + ' €)' : ''}</option>`).join('')}
        </select></div>
      </div>
      <div class="tier-feats">${d.feats.map(f => `<div class="tff">${f}</div>`).join('')}</div>
      ${d.cl ? `<div class="co" onclick="this.querySelector('.co-box').classList.toggle('on');calcT('${id}')">
        <div class="co-box"></div><span class="co-txt">Option Claude API (Anthropic)</span><span class="co-p">+299 €</span>
      </div>` : ''}
      <div class="ttot"><span class="ttl">Total estimé</span><span class="ttv">${d.base.toLocaleString('fr-BE')} €</span></div>
      <a href="#contact" class="tcta">Intéressé — Obtenir un devis</a>
      <div class="tsub">${d.sub}</div>
    `;
    grid.appendChild(div);
  });
}
function setG(g) {
  cg = g;
  document.getElementById('pso').classList.toggle('on', g === 'solo');
  document.getElementById('ppm').classList.toggle('on', g === 'pme');
  renderP(g);
}
renderP('pme');