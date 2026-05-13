// ── TYPEWRITER ──
const messages=["3 tâches urgentes : devis Moreau (€12k) à signer, réunion équipe à 14h, facture Dupont en attente de validation.","Je coordonne vos 4 agents. Comptable, Secrétaire, Service Client et RH sont actifs. Que souhaitez-vous déléguer ?"];
let mi=0,ci=0,ti=null;
function typeNext(){
  const el=document.getElementById('typing-text');
  if(!el)return;
  const msg=messages[mi];
  if(ci<msg.length){el.textContent=msg.slice(0,++ci);ti=setTimeout(typeNext,28)}
  else{setTimeout(()=>{ci=0;mi=(mi+1)%messages.length;el.textContent='';typeNext()},3500)}
}
setTimeout(typeNext,800);

// ── TABS ──
function switchTab(i){
  document.querySelectorAll('.t-tab').forEach((t,j)=>t.classList.toggle('active',j===i));
  document.querySelectorAll('.t-panel').forEach((p,j)=>p.classList.toggle('active',j===i));
}

// ── REVEAL ──
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ── FAQ ──
const faqs=[
  ["Mes données sont-elles vraiment privées ?","Absolument. Le serveur est physiquement chez vous. Les modèles IA tournent en local, sans connexion internet requise pour fonctionner. Vos données ne quittent jamais vos locaux. Même Atlas-IA n'y a pas accès."],
  ["Que se passe-t-il si le serveur tombe ?","L'agent système Watchdog surveille en permanence la santé du serveur et le redémarre automatiquement en cas de problème. En cas d'incident majeur, notre équipe est alertée et intervient sous 4h (formule Business Pro)."],
  ["Est-ce difficile à utiliser au quotidien ?","Non. L'interface est pensée pour des non-techniciens. Vous parlez à vos agents par texte ou par voix, comme à un collègue. La formation de 2 à 4h incluse suffit pour être pleinement autonome."],
  ["Puis-je ajouter des agents plus tard ?","Oui, à tout moment. Les agents s'installent comme des modules. Vous payez uniquement ceux dont vous avez besoin, quand vous en avez besoin."],
  ["Quelle différence avec ChatGPT ou Copilot ?","ChatGPT envoie vos données à OpenAI, coûte un abonnement mensuel, et tombe en panne si internet coupe. Atlas-IA tourne 100% en local, vous appartient, et reste disponible même sans réseau."],
  ["Y a-t-il un abonnement obligatoire ?","Non. Le prix unique couvre le hardware, l'installation et 6 mois de support. Le support continu après 6 mois est optionnel. Vous êtes libre."],
  ["Puis-je avoir l'IA Claude d'Anthropic plutôt qu'un modèle local ?","Oui. Nous proposons une option d'intégration Claude API (modèles plus puissants). Vous créez votre propre compte Anthropic — vous gardez le contrôle total des coûts et de vos données."],
  ["Dans quelles zones livrez-vous ?","Belgique, France, Luxembourg, Pays-Bas et Suisse pour le moment. Installation sur site incluse dans ces zones."],
];
const fg=document.getElementById('faq-grid');
faqs.forEach(([q,a])=>{
  const d=document.createElement('div');d.className='faq-item';
  d.innerHTML=`<button class="faq-question" onclick="toggleFaq(this)">${q}<span class="faq-icon">+</span></button><div class="faq-answer"><p>${a}</p></div>`;
  fg.appendChild(d);
});
function toggleFaq(btn){
  const item=btn.parentElement;
  const wasOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
  if(!wasOpen)item.classList.add('open');
}

// ── PRICING ENGINE ──
let currentGamme='pme';
const BASE_PRICES_PME={hobby:1299,business:1799,pro:3999};
const BASE_PRICES_SOLO={starter:799};

const RAM_OPTS=[{label:'8 GB (base)',delta:0},{label:'16 GB',delta:80}];
const SSD_OPTS_HOBBY=[{label:'256 GB (base)',delta:0},{label:'512 GB',delta:40},{label:'1 TB',delta:80},{label:'2 TB',delta:140}];
const SSD_OPTS_BIZ=[{label:'1 TB (base)',delta:0},{label:'2 TB',delta:80},{label:'4 TB',delta:200}];
const SSD_OPTS_PRO=[{label:'1 TB (base)',delta:0},{label:'2 TB',delta:100},{label:'4 TB (RAID)',delta:280},{label:'8 TB (RAID)',delta:520}];

function getTotal(basePrice,ramIdx,ssdIdx,claudeChecked,ramOpts,ssdOpts){
  return basePrice+(ramOpts[ramIdx]?.delta||0)+(ssdOpts[ssdIdx]?.delta||0)+(claudeChecked?299:0);
}

function buildSelect(opts,cardId,type,base,ramOpts,ssdOpts,clauseId){
  return`<select class="config-select" onchange="updatePrice('${cardId}',${base},'${type}',this.value,'${clauseId}','${JSON.stringify(ramOpts).replace(/'/g,"&#39;")}','${JSON.stringify(ssdOpts).replace(/'/g,"&#39;")}')">
    ${opts.map((o,i)=>`<option value="${i}">${o.label}</option>`).join('')}
  </select>`;
}

function updatePrice(cardId,base,changedType,val,claudeId,ramOptsStr,ssdOptsStr){
  const card=document.getElementById(cardId);
  if(!card)return;
  const ramOpts=JSON.parse(decodeURIComponent(ramOptsStr.replace(/&#39;/g,"'")));
  const ssdOpts=JSON.parse(decodeURIComponent(ssdOptsStr.replace(/&#39;/g,"'")));
  const ramSel=card.querySelector('[data-type="ram"]');
  const ssdSel=card.querySelector('[data-type="ssd"]');
  const claudeEl=document.getElementById(claudeId);
  const ramIdx=ramSel?parseInt(ramSel.value):0;
  const ssdIdx=ssdSel?parseInt(ssdSel.value):0;
  const claudeChecked=claudeEl?.classList.contains('checked')||false;
  const total=getTotal(base,ramIdx,ssdIdx,claudeChecked,ramOpts,ssdOpts);
  const tv=card.querySelector('.price-total-val');
  if(tv)tv.textContent=total.toLocaleString('fr-BE')+'€';
}

function toggleClaude(el,cardId,base,ramOptsStr,ssdOptsStr){
  el.classList.toggle('checked');
  const card=document.getElementById(cardId);
  const ramOpts=JSON.parse(ramOptsStr);
  const ssdOpts=JSON.parse(ssdOptsStr);
  const ramSel=card.querySelector('[data-type="ram"]');
  const ssdSel=card.querySelector('[data-type="ssd"]');
  const ramIdx=ramSel?parseInt(ramSel.value):0;
  const ssdIdx=ssdSel?parseInt(ssdSel.value):0;
  const total=getTotal(base,ramIdx,el.classList.contains('checked'),ramOpts,ssdOpts);
  const tv=card.querySelector('.price-total-val');
  if(tv)tv.textContent=total.toLocaleString('fr-BE')+'€';
}

function renderPricing(gamme){
  const grid=document.getElementById('pricing-grid');
  grid.innerHTML='';
  if(gamme==='solo'){
    grid.style.gridTemplateColumns='1fr';
    grid.innerHTML=buildCard({
      id:'card-starter',name:'Hobby',tier:'Solo — Particulier',
      hw:'Raspberry Pi 5 — RAM & SSD configurables',
      base:799,featured:false,
      feats:['1 agent IA local inclus (Phi / Mistral 7B)','~50 tokens/sec','Installation 24-48h (visio ou sur site)','Formation 1h incluse','Support 3 mois inclus','1 canal d\'intégration (Telegram, Discord ou UI web)'],
      ramOpts:RAM_OPTS,ssdOpts:SSD_OPTS_HOBBY,
      hasClaude:false,sub:'Support continu optionnel : 99€/mois',
      limits:['Maximum 1 agent actif','Interface simplifiée — pas de Dashboard Pro','Intégrations limitées à 1 canal']
    });
  } else {
    grid.style.gridTemplateColumns='repeat(3,1fr)';
    grid.innerHTML=
      buildCard({id:'card-hobby',name:'Hobby',tier:'Solo / PME débutante',hw:'Raspberry Pi 5 — RAM & SSD configurables',base:1299,featured:false,feats:['1 agent IA local (Phi / Mistral 7B)','~50 tokens/sec','Installation 24-48h','Formation 2h incluse','Support 6 mois inclus','1 canal d\'intégration'],ramOpts:RAM_OPTS,ssdOpts:SSD_OPTS_HOBBY,hasClaude:true,sub:'Support continu : 99€/mois'})+
      buildCard({id:'card-biz',name:'Business',tier:'PME — Recommandé',hw:'Raspberry Pi 5 16GB + SSD configurable',base:1799,featured:true,feats:['Jusqu\'à 3 agents spécialisés (au choix)','Modèle Mistral 7B — ~50 tok/sec','Installation sur site 24-48h','Formation 3h incluse','Support 6 mois prioritaire','Dashboard Pro complet','Application Jarvis (mobile + desktop)','Jusqu\'à 3 canaux d\'intégration'],ramOpts:[{label:'16 GB (inclus)',delta:0}],ssdOpts:SSD_OPTS_BIZ,hasClaude:true,sub:'Support continu : 150€/mois'})+
      buildCard({id:'card-pro',name:'Business Pro',tier:'PME haute performance',hw:'i7 + RTX 4070 + 32GB RAM + SSD',base:3999,featured:false,feats:['Jusqu\'à 5 agents spécialisés (au choix)','Mistral 70B ou Llama 3 70B — 100+ tok/sec','Installation sur site 48-72h','Formation 4h + documentation','Support 6 mois (intervention 4h)','Dashboard Pro + API accès','Application Jarvis complète','RAG custom sur vos données','Intégrations illimitées'],ramOpts:[{label:'32 GB (inclus)',delta:0}],ssdOpts:SSD_OPTS_PRO,hasClaude:true,sub:'Support continu : 200€/mois'});
  }
  document.querySelectorAll('.reveal').forEach(el=>{
    if(!el.classList.contains('visible'))obs.observe(el);
  });
}

function buildCard({id,name,tier,hw,base,featured,feats,ramOpts,ssdOpts,hasClaude,sub,limits}){
  const claudeId=`claude-${id}`;
  const ramOptsJSON=JSON.stringify(ramOpts);
  const ssdOptsJSON=JSON.stringify(ssdOpts);
  return`<div class="price-card${featured?' featured':''} reveal" id="${id}">
    ${featured?'<div class="price-badge">Recommandé</div>':''}
    <div class="price-tier">${tier}</div>
    <div class="price-name">${name}</div>
    <div class="price-hw">${hw}</div>
    <div class="price-main">
      <span class="price-from">à partir de</span>
      <span class="price-currency">€</span>
      <span class="price-val">${base.toLocaleString('fr-BE')}</span>
    </div>
    <div class="price-config">
      ${ramOpts.length>1?`<div class="config-row"><span class="config-label">RAM</span>
        <select class="config-select" data-type="ram" onchange="updatePrice('${id}',${base},'ram',this.value,'${claudeId}',encodeURIComponent('${ramOptsJSON}'),encodeURIComponent('${ssdOptsJSON}'))">
          ${ramOpts.map((o,i)=>`<option value="${i}">${o.label}${o.delta?` (+${o.delta}€)`:''}</option>`).join('')}
        </select>
      </div>`:''}
      <div class="config-row"><span class="config-label">SSD</span>
        <select class="config-select" data-type="ssd" onchange="updatePrice('${id}',${base},'ssd',this.value,'${claudeId}',encodeURIComponent('${ramOptsJSON}'),encodeURIComponent('${ssdOptsJSON}'))">
          ${ssdOpts.map((o,i)=>`<option value="${i}">${o.label}${o.delta?` (+${o.delta}€)`:''}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="price-features">
      ${feats.map(f=>`<div class="price-feat"><span class="feat-check">✓</span><span>${f}</span></div>`).join('')}
      ${(limits||[]).map(l=>`<div class="price-feat" style="opacity:.5"><span class="feat-check" style="color:var(--text3)">—</span><span style="color:var(--text3)">${l}</span></div>`).join('')}
    </div>
    ${hasClaude?`<div class="price-claude">
      <div class="claude-row">
        <div class="claude-check" id="${claudeId}" onclick="toggleClaude(this,'${id}',${base},'${ramOptsJSON}','${ssdOptsJSON}')"></div>
        <div>
          <div class="claude-text" style="font-weight:500;color:var(--text)">Option Claude API (Anthropic)</div>
          <div class="claude-text">Modèles IA plus puissants via votre compte Anthropic.</div>
        </div>
        <span class="claude-price">+299€</span>
      </div>
    </div>`:''}
    <div class="price-total-row">
      <span class="price-total-label">Total estimé</span>
      <span class="price-total-val">${base.toLocaleString('fr-BE')}€</span>
    </div>
    <button class="price-cta" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Intéressé ? Obtenir un devis</button>
    <div class="price-sub">${sub}</div>
  </div>`;
}

function setGamme(g){
  currentGamme=g;
  document.getElementById('togswitch').classList.toggle('pme',g==='pme');
  document.getElementById('tog-solo').style.color=g==='solo'?'var(--text)':'var(--text3)';
  document.getElementById('tog-pme').style.color=g==='pme'?'var(--text)':'var(--text3)';
  renderPricing(g);
}
renderPricing('pme');

// ── FORM SUBMIT ──
function handleSubmit(btn){
  btn.textContent='Message envoyé ✓';
  btn.style.background='#2d6a4f';
  btn.disabled=true;
}
