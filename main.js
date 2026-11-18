(function(){var d=document,r=d.documentElement,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;r.classList.add('js');if(rm)r.classList.add('rm');
var fa=r.lang==='fa';
function mk(c,t,i){var k=d.createElement('span');k.className=c;k.style.setProperty('--i',i);k.textContent=t;return k}
d.querySelectorAll('[data-split]').forEach(function(el){var t=el.textContent.trim(),i=0;el.setAttribute('aria-label',t);el.textContent='';
t.split(/\s+/).forEach(function(w){var s=d.createElement('span');s.className='w';s.setAttribute('aria-hidden','true');
if(fa){s.appendChild(mk('c',w,i++))}else{w.split('').forEach(function(ch){s.appendChild(mk('c',ch,i++))})}
el.appendChild(s);el.appendChild(d.createTextNode(' '))})});
var nf=new Intl.NumberFormat(fa?'fa-IR':'en',{useGrouping:false});
function count(el){var to=parseFloat(el.getAttribute('data-to')),t0=null,dur=1400;function f(ts){if(t0===null)t0=ts;var p=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=nf.format(Math.round(to*e));if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;el.classList.add('in');if(el.classList.contains('count')&&!rm)count(el);io.unobserve(el)})},{threshold:.2});
d.querySelectorAll('.rv,[data-split],.count,.dg').forEach(function(e){io.observe(e)});
var links=[].slice.call(d.querySelectorAll('[data-spy] a[href^="#"]'));
if(links.length){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});
links.forEach(function(a){var s=d.querySelector(a.getAttribute('href'));if(s)so.observe(s)})}
if(!rm){var tk=0;function up(){tk=0;var h=r.scrollHeight-innerHeight;r.style.setProperty('--p',h>0?Math.min(1,scrollY/h).toFixed(4):0)}
addEventListener('scroll',function(){if(!tk){tk=requestAnimationFrame(up)}},{passive:true});up()}
})();
