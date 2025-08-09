// Fallback: IntersectionObserver でふわっと上がる
const io = ('IntersectionObserver' in window)
  ? new IntersectionObserver(es => es.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), {threshold:.15})
  : null;

document.querySelectorAll('.card-parallax, .step-parallax').forEach(el => io && io.observe(el));

// ToTop
const toTop=document.querySelector('.to-top');
window.addEventListener('scroll',()=>toTop.classList.toggle('show',window.scrollY>500),{passive:true});
toTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));