const nav = document.getElementById('nav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>60);
});

const burger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click',()=>navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')});
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// HERO MARQUEE — crossfade between 3 photos
const heroImgs = document.querySelectorAll('#heroMarquee .hero-img');
const heroDots = document.querySelectorAll('#heroDots button');
let heroIndex = 0;
function showHeroImg(i){
  heroImgs.forEach((img,idx)=>img.classList.toggle('is-active',idx===i));
  heroDots.forEach((dot,idx)=>dot.classList.toggle('is-active',idx===i));
  heroIndex = i;
}
heroDots.forEach((dot,idx)=>dot.addEventListener('click',()=>showHeroImg(idx)));
setInterval(()=>showHeroImg((heroIndex+1)%heroImgs.length), 6000);
