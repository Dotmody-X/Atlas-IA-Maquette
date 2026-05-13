// ── CURSOR ──
const dot=document.getElementById('cursor-dot');
const coord=document.getElementById('cursor-coord');
const cur=document.getElementById('cursor');
let mx=0,my=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.transform=`translate(${mx}px,${my}px)`;
  const x=(mx/window.innerWidth*10).toFixed(3);
  const y=(my/window.innerHeight*10).toFixed(3);
  coord.textContent=x+', '+y;
});

// ── CONSOLE TABS ──
function sCP(i,el){
  document.querySelectorAll('.c-tab').forEach((t,j)=>t.classList.toggle('on',j===i));
  document.querySelectorAll('.cpanel').forEach((p,j)=>p.classList.toggle('on',j===i));
}

// ── REVEAL ──
const obs=new IntersectionObserver(e=>e.forEach(el=>{if(el.isIntersecting){el.target.classList.add('in');obs.unobserve(el.target)}}),{threshold:.07});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ── FAQ ──
const faqs=[
  ["Mes données sont-elles vraiment privées ?","Absolument. Le serveur est chez vous. Les modèles IA tournent en local, sans connexion internet requise. Vos données ne quittent jamais votre réseau."],
  ["Que se passe-t-il si le serveur tombe ?","L'agent Watchdog surveille en permanence et redémarre automatiquement les services. En cas d'incident majeur, notre équipe intervient sous 4h (Business Pro)."],
  ["Est-ce difficile à utiliser ?","Non. Interface pensée pour les non-techniciens. La formation 2 à 4h incluse suffit pour être pleinement autonome."],
  ["Puis-je ajouter des agents plus tard ?","Oui, à tout moment. Les agents s'installent comme des modules. Vous payez uniquement ceux dont vous avez besoin."],
  ["Quelle différence avec ChatGPT ?","ChatGPT envoie vos données à OpenAI, coûte un abonnement mensuel, et tombe si internet coupe. Atlas-IA tourne 100% en local, vous appartient, fonctionne sans réseau."],
  ["Y a-t-il un abonnement obligatoire ?","Non. Prix unique : hardware, installation et 6 mois de support. Support continu optionnel après 6 mois."],
  ["Puis-je avoir Claude d'Anthropic ?","Oui. Option Claude API (+299€ setup). Vous créez votre propre compte Anthropic — contrôle total des coûts et données."],
  ["Zones de livraison ?","Belgique, France, Luxembourg, Pays-Bas et Suisse. Installation sur site incluse."],
];
const fg=document.getElementById('faq-grid');
faqs.forEach(([q,a])=>{
  const d=document.createElement('div');d.className='faq-card';
  d.innerHTML=`<button class="faq-q">${q}<i class="fa-solid fa-plus"></i></button><div class="faq-a"><p>${a}</p></div>`;
  d.querySelector('.faq-q').onclick=()=>{const o=d.classList.contains('open');document.querySelectorAll('.faq-card.open').forEach(i=>i.classList.remove('open'));if(!o)d.classList.add('open')};
  fg.appendChild(d);
});

// ── PRICING ──
let cg='pme';
const DATA={
  solo:{hobby:{name:'Hobby',tier:'Solo / Particulier',hw:'Raspberry Pi 5 · RAM & SSD configurables',base:799,featured:false,feats:['1 agent IA local (Phi / Mistral 7B)','~50 tokens / sec','Installation 24-48h','Formation 1h','Support 3 mois','1 canal d\'intégration'],ramOpts:[{l:'8 GB',d:0},{l:'16 GB',d:80}],ssdOpts:[{l:'256 GB',d:0},{l:'512 GB',d:40},{l:'1 TB',d:80},{l:'2 TB',d:140}],claude:false,sub:'Support continu optionnel : 99 €/mois'}},
  pme:{
    hobby:{name:'Hobby',tier:'PME débutante',hw:'Raspberry Pi 5 · RAM & SSD configurables',base:1299,featured:false,feats:['1 agent IA local (Mistral 7B)','~50 tok/sec','Installation 24-48h','Formation 2h','Support 6 mois','1 canal d\'intégration'],ramOpts:[{l:'8 GB',d:0},{l:'16 GB',d:80}],ssdOpts:[{l:'256 GB',d:0},{l:'512 GB',d:40},{l:'1 TB',d:80},{l:'2 TB',d:140}],claude:true,sub:'Support continu : 99 €/mois'},
    biz:{name:'Business',tier:'PME · Recommandé',hw:'Raspberry Pi 5 16GB + SSD configurable',base:1799,featured:true,feats:['Jusqu\'à 3 agents spécialisés (au choix)','Mistral 7B · ~50 tok/sec','Installation sur site 24-48h','Formation 3h + documentation','Support 6 mois prioritaire','Dashboard Pro + Jarvis app','Jusqu\'à 3 canaux d\'intégration'],ramOpts:[{l:'16 GB (inclus)',d:0}],ssdOpts:[{l:'1 TB',d:0},{l:'2 TB',d:80},{l:'4 TB',d:200}],claude:true,sub:'Support continu : 150 €/mois'},
    pro:{name:'Business Pro',tier:'PME haute performance',hw:'i7 + RTX 4070 + 32GB RAM + SSD',base:3999,featured:false,feats:['Jusqu\'à 5 agents spécialisés (au choix)','Mistral 70B / Llama 3 70B · 100+ tok/sec','Installation sur site 48-72h','Formation 4h + documentation','Support 6 mois (intervention 4h)','Dashboard Pro + API + Jarvis','RAG sur vos données propriétaires','Intégrations illimitées'],ramOpts:[{l:'32 GB (inclus)',d:0}],ssdOpts:[{l:'1 TB',d:0},{l:'2 TB',d:100},{l:'4 TB RAID',d:280},{l:'8 TB RAID',d:520}],claude:true,sub:'Support continu : 200 €/mois'}
  }
};
function calcT(id){
  const card=document.getElementById(id);if(!card)return;
  const c=card._cfg;
  const ri=+(card.querySelector('[data-t="ram"]')?.value||0);
  const si=+(card.querySelector('[data-t="ssd"]')?.value||0);
  const cl=card.querySelector('.co-box')?.classList.contains('on')||false;
  const t=c.base+(c.ramOpts[ri]?.d||0)+(c.ssdOpts[si]?.d||0)+(cl?299:0);
  const el=card.querySelector('.tt-val');if(el)el.textContent=t.toLocaleString('fr-BE')+' €';
}
function renderP(g){
  const grid=document.getElementById('pgrid');
  const tiers=DATA[g];const keys=Object.keys(tiers);
  grid.style.gridTemplateColumns=`repeat(${keys.length},1fr)`;
  grid.innerHTML='';
  keys.forEach(k=>{
    const c=tiers[k];const id='t-'+k;
    const div=document.createElement('div');
    div.className='tier'+(c.featured?' featured':'');
    div._cfg=c;div.id=id;
    div.innerHTML=`
      ${c.featured?'<span class="tier-tag">— Recommandé</span>':''}
      <span class="tier-name">${c.tier}</span>
      <div class="tier-price">${c.base.toLocaleString('fr-BE')} €</div>
      <span class="tier-from">à partir de · achat unique</span>
      <div class="tier-hw">${c.hw}</div>
      <div class="tier-config">
        ${c.ramOpts.length>1?`<div class="cfg-row"><span class="cfg-lbl">RAM</span><select class="cfg-sel" data-t="ram" onchange="calcT('${id}')">
          ${c.ramOpts.map((o,i)=>`<option value="${i}">${o.l}${o.d?' (+'+o.d+' €)':''}</option>`).join('')}
        </select></div>`:''}
        <div class="cfg-row"><span class="cfg-lbl">SSD</span><select class="cfg-sel" data-t="ssd" onchange="calcT('${id}')">
          ${c.ssdOpts.map((o,i)=>`<option value="${i}">${o.l}${o.d?' (+'+o.d+' €)':''}</option>`).join('')}
        </select></div>
      </div>
      <div class="tier-feats">${c.feats.map(f=>`<div class="tf">${f}</div>`).join('')}</div>
      ${c.claude?`<div class="claude-opt" onclick="this.querySelector('.co-box').classList.toggle('on');calcT('${id}')">
        <div class="co-box"></div><span class="co-txt">Option Claude API (Anthropic)</span><span class="co-price">+299 €</span>
      </div>`:''}
      <div class="tier-total"><span class="tt-lbl">Total estimé</span><span class="tt-val">${c.base.toLocaleString('fr-BE')} €</span></div>
      <a href="#contact" class="tier-cta">Intéressé — Obtenir un devis</a>
      <div class="tier-sub">${c.sub}</div>
    `;
    grid.appendChild(div);
  });
}
function setG(g){
  cg=g;
  document.getElementById('pt-solo').classList.toggle('on',g==='solo');
  document.getElementById('pt-pme').classList.toggle('on',g==='pme');
  renderP(g);
}
renderP('pme');