// Ripple（軽いまま）
document.querySelectorAll('.ripple').forEach(btn=>{
  btn.addEventListener('click',e=>{
    const ink=document.createElement('span'); ink.className='ink';
    const r=btn.getBoundingClientRect(); ink.style.left=(e.clientX-r.left)+'px'; ink.style.top=(e.clientY-r.top)+'px';
    btn.appendChild(ink); setTimeout(()=>ink.remove(),520);
  });
});

// Lightbox
const lb=document.querySelector('.lightbox'), lbImg=document.querySelector('.lightbox-img'), lbClose=document.querySelector('.lightbox-close');
function openLB(src){lbImg.src=src; lb.classList.add('is-open');}
function closeLB(){lb.classList.remove('is-open'); lbImg.src='';}
document.addEventListener('click',e=>{
  const t=e.target.closest('.lightbox-trigger');
  if(t){ e.preventDefault(); openLB(t.dataset.img || t.src); }
});
lbClose?.addEventListener('click',closeLB);
lb?.addEventListener('click',e=>{ if(e.target===lb) closeLB(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeLB(); });

// 画像フォールバック
document.querySelectorAll('img[data-fallback]').forEach(img=>{
  const cand=[img.src, img.dataset.fallback].filter(Boolean); let i=0;
  img.addEventListener('error',()=>{ i++; if(i<cand.length) img.src=cand[i]; });
});

// ===== 軽量パララックス（スクロール時のみ／ビューポート内だけ） =====
// 対象要素を最小限に（当日の流れだけ）
const parallaxEls = Array.from(document.querySelectorAll('.steps .step'));
const inview = new Set();

const ioParallax = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){ inview.add(en.target); en.target.classList.add('will'); }
    else { inview.delete(en.target); en.target.style.transform=''; en.target.classList.remove('will'); }
  });
},{rootMargin:'-10% 0px -10% 0px'});
parallaxEls.forEach(el=>ioParallax.observe(el));

let ticking=false;
function parallaxScroll(){
  // prefers-reduced-motion のときは無効
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){ ticking=false; return; }
  const vh = window.innerHeight || 800;
  inview.forEach(el=>{
    const r = el.getBoundingClientRect();
    const center = r.top + r.height/2;
    const delta = (center - vh/2) / (vh/2);      // -1〜1
    const ty = Math.max(-1, Math.min(1, -delta)) * 12; // 以前より弱め（12px）
    el.style.transform = `translateY(${ty}px)`;        // scale をカットして軽量化
  });
  ticking=false;
}
function onScroll(){
  if(!ticking){ ticking=true; requestAnimationFrame(parallaxScroll); }
}
window.addEventListener('scroll', onScroll, {passive:true});
window.addEventListener('resize', parallaxScroll, {passive:true});
parallaxScroll();

// ===== 反射スイープ（入場時のみ1回） =====
const shineTargets = [
  ...document.querySelectorAll('.steps .step'),
  ...document.querySelectorAll('.student-card')
];
shineTargets.forEach(el=>el.classList.add('has-shine'));

const ioShine = new IntersectionObserver(es=>{
  es.forEach(en=>{
    if(en.isIntersecting){
      const el=en.target;
      el.classList.add('shine-run');
      setTimeout(()=>el.classList.remove('shine-run'), 1200);
      ioShine.unobserve(el); // 一度きりで解除→軽量
    }
  });
},{threshold:0.2});
shineTargets.forEach(el=>ioShine.observe(el));

// ToTop
const toTop=document.querySelector('.to-top');
window.addEventListener('scroll',()=>{ toTop?.classList.toggle('show',window.scrollY>400); },{passive:true});
toTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));