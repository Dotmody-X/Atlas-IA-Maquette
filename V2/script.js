// Console tabs
function switchTab(i,el){
  document.querySelectorAll('.console-tab').forEach((t,j)=>t.classList.toggle('active',j===i));
  document.querySelectorAll('.console-panel').forEach((p,j)=>p.classList.toggle('active',j===i));
}

// FAQ
const faqs=[
  ["Mes données sont-elles vraiment privées ?","Absolument. Le serveur est dans vos locaux. Les modèles IA tournent en local, sans connexion internet requise. Vos données ne quittent jamais votre réseau. Atlas-IA n'y a aucun accès."],
  ["Que se passe-t-il si le serveur tombe ?","L'agent Watchdog surveille en permanence et redémarre automatiquement les services. En cas d'incident majeur, notre équipe est alertée et intervient sous 4h (Business Pro)."],
  ["Est-ce difficile à utiliser ?","Non. L'interface est pensée pour des non-techniciens. Vous parlez à vos agents comme à un collègue. La formation de 2 à 4h incluse suffit pour être pleinement autonome."],
  ["Puis-je ajouter des agents plus tard ?","Oui, à tout moment. Les agents s'installent comme des modules. Vous payez uniquement ceux dont vous avez besoin, quand vous en avez besoin."],
  ["Quelle différence avec ChatGPT ?","ChatGPT envoie vos données à OpenAI, coûte un abonnement mensuel, et tombe si internet coupe. Atlas-IA tourne 100% en local, vous appartient, et reste disponible même sans réseau."],
  ["Y a-t-il un abonnement obligatoire ?","Non. Le prix unique couvre hardware, installation et 6 mois de support. Le support continu après 6 mois est optionnel. Vous êtes libre."],
  ["Puis-je avoir Claude d'Anthropic ?","Oui. Option d'intégration Claude API disponible (+299€ setup). Vous créez votre propre compte Anthropic et gardez le contrôle total de vos coûts et données."],
  ["Dans quelles zones installez-vous ?","Belgique, France, Luxembourg, Pays-Bas et Suisse. Installation sur site incluse dans ces zones."],
];
const fg=document.getElementById('faq-grid');
faqs.forEach(([q,a])=>{
  const d=document.createElement('div');d.className='faq-item';
  d.innerHTML=`<h4>${q} <i class="fa-solid fa-plus faq-icon"></i></h4><div class="faq-answer"><p>${a}</p></div>`;
  d.querySelector('h4').onclick=()=>{
    const o=d.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
    if(!o)d.classList.add('open');
  };
  fg.appendChild(d);
});

// Pricing
let cg='pme';
const R={
  solo:{
    hobby:{name:'Hobby',tier:'Solo · Particulier',hw:'Raspberry Pi 5 · RAM & SSD configurables',base:799,featured:false,feats:['1 agent IA local (Phi / Mistral 7B)','~50 tokens / sec','Installation 24-48h (visio ou sur site)','Formation 1h incluse','Support 3 mois inclus','1 canal d\'intégration au choix'],ramOpts:[{l:'8 GB (base)',d:0},{l:'16 GB',d:80}],ssdOpts:[{l:'256 GB (base)',d:0},{l:'512 GB',d:40},{l:'1 TB',d:80},{l:'2 TB',d:140}],claude:false,sub:'Support continu optionnel : 99 €/mois'}
  },
  pme:{
    hobby:{name:'Hobby',tier:'PME débutante',hw:'Raspberry Pi 5 · RAM & SSD configurables',base:1299,featured:false,feats:['1 agent IA local (Mistral 7B)','~50 tokens / sec','Installation 24-48h','Formation 2h incluse','Support 6 mois','1 canal d\'intégration'],ramOpts:[{l:'8 GB (base)',d:0},{l:'16 GB',d:80}],ssdOpts:[{l:'256 GB (base)',d:0},{l:'512 GB',d:40},{l:'1 TB',d:80},{l:'2 TB',d:140}],claude:true,sub:'Support continu : 99 €/mois'},
    biz:{name:'Business',tier:'PME · Recommandé',hw:'Raspberry Pi 5 16GB + SSD configurable',base:1799,featured:true,feats:['Jusqu\'à 3 agents spécialisés (au choix)','Mistral 7B · ~50 tok/sec','Installation sur site 24-48h','Formation 3h incluse','Support 6 mois prioritaire','Dashboard Pro + Jarvis app','Jusqu\'à 3 canaux d\'intégration'],ramOpts:[{l:'16 GB (inclus)',d:0}],ssdOpts:[{l:'1 TB (base)',d:0},{l:'2 TB',d:80},{l:'4 TB',d:200}],claude:true,sub:'Support continu : 150 €/mois'},
    pro:{name:'Business Pro',tier:'PME haute performance',hw:'i7 + RTX 4070 + 32GB RAM + SSD',base:3999,featured:false,feats:['Jusqu\'à 5 agents spécialisés (au choix)','Mistral 70B / Llama 3 70B · 100+ tok/sec','Installation sur site 48-72h','Formation 4h + documentation','Support 6 mois (intervention 4h)','Dashboard Pro + API + Jarvis','RAG sur vos données propriétaires','Intégrations illimitées'],ramOpts:[{l:'32 GB (inclus)',d:0}],ssdOpts:[{l:'1 TB (base)',d:0},{l:'2 TB',d:100},{l:'4 TB RAID',d:280},{l:'8 TB RAID',d:520}],claude:true,sub:'Support continu : 200 €/mois'}
  }
};

function calcTotal(id){
  const card=document.getElementById(id);if(!card)return;
  const cfg=card._cfg;
  const ri=card.querySelector('[data-t="ram"]')?.value||0;
  const si=card.querySelector('[data-t="ssd"]')?.value||0;
  const claude=card.querySelector('.claude-box')?.classList.contains('on')||false;
  const t=cfg.base+(cfg.ramOpts[ri]?.d||0)+(cfg.ssdOpts[si]?.d||0)+(claude?299:0);
  const el=card.querySelector('.tier-total-val');
  if(el)el.textContent=t.toLocaleString('fr-BE')+' €';
}

function renderPricing(gamme){
  const grid=document.getElementById('pricing-grid');
  const tiers=R[gamme];
  const keys=Object.keys(tiers);
  grid.style.gridTemplateColumns=`repeat(${keys.length},1fr)`;
  grid.innerHTML='';
  keys.forEach(k=>{
    const c=tiers[k];
    const id='tier-'+k;
    const div=document.createElement('div');
    div.className='tier'+(c.featured?' featured':'');
    div._cfg=c;
    div.id=id;
    div.innerHTML=`
      ${c.featured?'<span class="tier-tag">Recommandé</span>':''}
      <span class="tier-name">${c.tier}</span>
      <div class="tier-price"><span class="num">${c.base.toLocaleString('fr-BE')} €</span><span class="per">à partir de</span></div>
      <p class="tier-desc">${c.hw}</p>
      <div class="tier-config">
        ${c.ramOpts.length>1?`<div class="config-row">
          <span class="config-lbl">RAM</span>
          <select class="config-sel" data-t="ram" onchange="calcTotal('${id}')">
            ${c.ramOpts.map((o,i)=>`<option value="${i}">${o.l}${o.d?` (+${o.d} €)`:''}</option>`).join('')}
          </select>
        </div>`:''}
        <div class="config-row">
          <span class="config-lbl">SSD</span>
          <select class="config-sel" data-t="ssd" onchange="calcTotal('${id}')">
            ${c.ssdOpts.map((o,i)=>`<option value="${i}">${o.l}${o.d?` (+${o.d} €)`:''}</option>`).join('')}
          </select>
        </div>
      </div>
      <ul>${c.feats.map(f=>`<li>${f}</li>`).join('')}</ul>
      ${c.claude?`<div class="claude-opt" onclick="this.querySelector('.claude-box').classList.toggle('on');calcTotal('${id}')">
        <div class="claude-box"></div>
        <div class="claude-txt">Option Claude API (Anthropic)</div>
        <span class="claude-price">+299 €</span>
      </div>`:''}
      <div class="tier-total">
        <span class="tier-total-lbl">Total estimé</span>
        <span class="tier-total-val">${c.base.toLocaleString('fr-BE')} €</span>
      </div>
      <a href="#contact" class="btn${c.featured?' btn-blue':' btn-ghost'}" style="width:100%;justify-content:center">Intéressé ? <span>→</span></a>
      <div class="tier-sub">${c.sub}</div>
    `;
    grid.appendChild(div);
  });
}

function setGamme(g){
  cg=g;
  document.getElementById('pt-track').classList.toggle('pme',g==='pme');
  document.getElementById('pt-solo').classList.toggle('on',true);
  document.getElementById('pt-pme').classList.toggle('on',true);
  renderPricing(g);
}
renderPricing('pme');