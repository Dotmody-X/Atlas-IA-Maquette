// CURSOR — lagged ring
const CUR=document.getElementById('CUR');
let tx=0,ty=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
function ac(){cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;CUR.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(ac)}ac();
document.querySelectorAll('a,button,.bc,.ag,.tst,.fk').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hov'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hov'));
});

// COUNTER
let v=0;const CE=document.getElementById('CNT');
function tick(){if(v<99){v+=Math.ceil((99-v)/7);CE.textContent=v;setTimeout(tick,28)}}
setTimeout(tick,500);

// CUBE
const CB=document.getElementById('CB');
if(CB){[['fr','AI'],['bk','IA'],['ri','24/7'],['le','0€'],['tp',''],['bt','']].forEach(([c,t])=>{
  const f=document.createElement('div');f.className=`cf ${c}`;if(t)f.textContent=t;CB.appendChild(f);
})}

// FLOATING KEYS
const KD=[
  {t:'IA',c:'ok',sz:90,l:'62%',tp:'18%',rx:20,rz:-6,dy:-22,d:4.2,dl:0},
  {t:'24/7',c:'',sz:74,l:'74%',tp:'35%',rx:18,rz:5,dy:-18,d:3.8,dl:.5},
  {t:'→',c:'gl',sz:80,l:'56%',tp:'52%',rx:22,rz:-4,dy:-20,d:5,dl:1},
  {t:'LOCAL',c:'ok',sz:98,l:'80%',tp:'12%',rx:15,rz:8,dy:-28,d:4.6,dl:.3},
  {t:'0€',c:'',sz:68,l:'86%',tp:'44%',rx:24,rz:-9,dy:-16,d:3.5,dl:.8},
  {t:'AI',c:'gl',sz:84,l:'51%',tp:'70%',rx:16,rz:6,dy:-24,d:4.8,dl:.2},
  {t:'⌘',c:'ok',sz:64,l:'70%',tp:'62%',rx:20,rz:-12,dy:-14,d:3.2,dl:1.2},
  {t:'48h',c:'',sz:76,l:'90%',tp:'26%',rx:14,rz:4,dy:-18,d:4,dl:.6},
];
const SC=document.getElementById('SC');
if(SC){KD.forEach(k=>{
  const w=document.createElement('div');
  w.className=`fk${k.c?' '+k.c:''}`;
  w.style.cssText=`position:absolute;width:${k.sz}px;height:${k.sz}px;left:${k.l};top:${k.tp};--rx:${k.rx}deg;--rz:${k.rz}deg;--dy:${k.dy}px;animation:flfk ${k.d}s ease-in-out ${k.dl}s infinite;`;
  const b=document.createElement('div');
  b.className='fkb';b.style.cssText=`font-size:${Math.round(k.sz*.16)}px;`;b.textContent=k.t;
  w.appendChild(b);SC.appendChild(w);
})}

// PARALLAX
const floaters=document.querySelectorAll('.fk,.sp,.sc3');
document.addEventListener('mousemove',e=>{
  const mx=(e.clientX/window.innerWidth-.5)*2;
  const my=(e.clientY/window.innerHeight-.5)*2;
  floaters.forEach((f,i)=>{
    const d=.4+((i%6)*.22);
    f.style.marginLeft=`${mx*22*d}px`;f.style.marginTop=`${my*18*d}px`;
  });
});

// REVEAL
const obs=new IntersectionObserver(e=>e.forEach(el=>{
  if(el.isIntersecting){el.target.classList.add('in');obs.unobserve(el.target)}
}),{threshold:.07});
document.querySelectorAll('.rev').forEach(el=>obs.observe(el));

// FAQ
const faqs=[
  ["Mes données sont-elles vraiment privées ?","Absolument. Le serveur est physiquement chez vous. Les modèles IA tournent en local, sans connexion internet requise. Vos données ne quittent jamais votre réseau."],
  ["Que se passe-t-il si le serveur tombe ?","L'agent Watchdog surveille en permanence et redémarre automatiquement. En cas d'incident majeur, notre équipe intervient sous 4h (Business Pro)."],
  ["Est-ce difficile à utiliser ?","Non. La formation 2 à 4h incluse suffit. Interface pensée pour les non-techniciens."],
  ["Puis-je ajouter des agents plus tard ?","Oui, à tout moment. Les agents s'installent comme des modules indépendants."],
  ["Quelle différence avec ChatGPT ?","ChatGPT envoie vos données à OpenAI et coûte un abonnement mensuel. Atlas-IA tourne 100% en local et vous appartient."],
  ["Y a-t-il un abonnement obligatoire ?","Non. Prix unique : hardware, installation et 6 mois de support. Support continu optionnel."],
  ["Puis-je avoir Claude d'Anthropic ?","Oui. Option +299€ setup. Vous créez votre propre compte Anthropic — contrôle total."],
  ["Zones de livraison ?","Belgique, France, Luxembourg, Pays-Bas, Suisse. Installation sur site incluse."],
];
const FG=document.getElementById('FG');
faqs.forEach(([q,a])=>{
  const d=document.createElement('div');d.className='fc';
  d.innerHTML=`<button class="fq">${q}<i class="fa-solid fa-plus"></i></button><div class="fa"><p>${a}</p></div>`;
  d.querySelector('.fq').onclick=()=>{const o=d.classList.contains('open');document.querySelectorAll('.fc.open').forEach(i=>i.classList.remove('open'));if(!o)d.classList.add('open')};
  FG.appendChild(d);
});

// PRICING
let cg='pme';
const D={
  solo:{h:{name:'Hobby',tier:'Solo / Particulier',hw:'Raspberry Pi 5 · RAM & SSD configurables',base:799,feat:false,feats:['1 agent IA local (Phi / Mistral 7B)','~50 tokens / sec','Installation 24-48h','Formation 1h','Support 3 mois','1 canal d\'intégration'],ram:[{l:'8 GB',d:0},{l:'16 GB',d:80}],ssd:[{l:'256 GB',d:0},{l:'512 GB',d:40},{l:'1 TB',d:80},{l:'2 TB',d:140}],cl:false,sub:'Support continu optionnel : 99 €/mois'}},
  pme:{
    h:{name:'Hobby',tier:'PME débutante',hw:'Raspberry Pi 5 · RAM & SSD',base:1299,feat:false,feats:['1 agent IA local (Mistral 7B)','~50 tok/sec','Installation 24-48h','Formation 2h','Support 6 mois','1 canal'],ram:[{l:'8 GB',d:0},{l:'16 GB',d:80}],ssd:[{l:'256 GB',d:0},{l:'512 GB',d:40},{l:'1 TB',d:80},{l:'2 TB',d:140}],cl:true,sub:'Support continu : 99 €/mois'},
    b:{name:'Business',tier:'PME · Recommandé',hw:'Raspberry Pi 5 16GB + SSD configurable',base:1799,feat:true,feats:['Jusqu\'à 3 agents spécialisés','Mistral 7B · ~50 tok/sec','Installation sur site 24-48h','Formation 3h + documentation','Support 6 mois prioritaire','Dashboard Pro + Jarvis app','Jusqu\'à 3 canaux d\'intégration'],ram:[{l:'16 GB (inclus)',d:0}],ssd:[{l:'1 TB',d:0},{l:'2 TB',d:80},{l:'4 TB',d:200}],cl:true,sub:'Support continu : 150 €/mois'},
    p:{name:'Business Pro',tier:'PME haute performance',hw:'i7 + RTX 4070 + 32GB RAM + SSD',base:3999,feat:false,feats:['Jusqu\'à 5 agents spécialisés','Mistral 70B / Llama 3 70B · 100+ tok/sec','Installation sur site 48-72h','Formation 4h + documentation','Support 6 mois (4h intervention)','Dashboard Pro + API + Jarvis','RAG sur vos données propriétaires','Intégrations illimitées'],ram:[{l:'32 GB (inclus)',d:0}],ssd:[{l:'1 TB',d:0},{l:'2 TB',d:100},{l:'4 TB RAID',d:280},{l:'8 TB RAID',d:520}],cl:true,sub:'Support continu : 200 €/mois'}
  }
};
function calcT(id){
  const c=document.getElementById(id);if(!c)return;
  const d=c._d;
  const ri=+(c.querySelector('[data-t="r"]')?.value||0);
  const si=+(c.querySelector('[data-t="s"]')?.value||0);
  const cl=c.querySelector('.cob')?.classList.contains('on')||false;
  const t=d.base+(d.ram[ri]?.d||0)+(d.ssd[si]?.d||0)+(cl?299:0);
  const el=c.querySelector('.ttv');if(el)el.textContent=t.toLocaleString('fr-BE')+' €';
}
function renderP(g){
  const grid=document.getElementById('PG');
  const tiers=D[g];const keys=Object.keys(tiers);
  grid.style.gridTemplateColumns=`repeat(${keys.length},1fr)`;
  grid.innerHTML='';
  keys.forEach(k=>{
    const d=tiers[k];const id='T'+k;
    const div=document.createElement('div');
    div.className='tier'+(d.feat?' ft':'');
    div._d=d;div.id=id;div.setAttribute('data-n',d.name.toUpperCase());
    div.innerHTML=`
      <span class="tiern">${d.tier}</span>
      <div class="tierp">${d.base.toLocaleString('fr-BE')} €</div>
      <span class="tierf">à partir de · achat unique</span>
      <div class="tierhw">${d.hw}</div>
      <div class="tcfg">
        ${d.ram.length>1?`<div class="trow"><span class="tlbl">RAM</span><select class="tsel" data-t="r" onchange="calcT('${id}')">
          ${d.ram.map((o,i)=>`<option value="${i}">${o.l}${o.d?' (+'+o.d+' €)':''}</option>`).join('')}
        </select></div>`:''}
        <div class="trow"><span class="tlbl">SSD</span><select class="tsel" data-t="s" onchange="calcT('${id}')">
          ${d.ssd.map((o,i)=>`<option value="${i}">${o.l}${o.d?' (+'+o.d+' €)':''}</option>`).join('')}
        </select></div>
      </div>
      <div class="tfeats">${d.feats.map(f=>`<div class="tff">${f}</div>`).join('')}</div>
      ${d.cl?`<div class="co" onclick="this.querySelector('.cob').classList.toggle('on');calcT('${id}')">
        <div class="cob"></div><span class="cotxt">Option Claude API (Anthropic)</span><span class="cop">+299 €</span>
      </div>`:''}
      <div class="ttot"><span class="ttl">Total estimé</span><span class="ttv">${d.base.toLocaleString('fr-BE')} €</span></div>
      <a href="#contact" class="tcta">Intéressé — Obtenir un devis</a>
      <div class="tsub">${d.sub}</div>
    `;
    grid.appendChild(div);
  });
}
function setG(g){
  cg=g;
  document.getElementById('pso').classList.toggle('on',g==='solo');
  document.getElementById('ppm').classList.toggle('on',g==='pme');
  renderP(g);
}
renderP('pme');