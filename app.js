<script>
/* ===== 反射（sweep）はCSSだけで動作。ここはスクロール連動だけ ===== */
(() => {
  // スクロールに合わせて、lift/parallax要素を上下にほんの少し動かす（iOSでも軽い）
  const els = [...document.querySelectorAll('.lift, [data-parallax]')];
  const speeds = new Map(els.map(el => [el, parseFloat(el.dataset.parallax || 0.12)]));
  const inView = new Set();

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e => {
      if (e.isIntersecting) inView.add(e.target);
      else inView.delete(e.target);
    });
  }, {rootMargin:'20% 0px 20% 0px'});
  els.forEach(el=>io.observe(el));

  let ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      inView.forEach(el=>{
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const progress = ((vh/2 - (r.top + r.height/2)) / vh); // -1〜1
        const dy = progress * (speeds.get(el) * 40); // 最大±40px
        el.style.transform = `translate3d(0, ${dy}px, 0)`;
      });
      ticking = false;
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
})();
</script>