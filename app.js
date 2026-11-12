(function(){
  'use strict';
  var doc=document;

  // menu mobilne
  var burger=doc.querySelector('.burger'),menu=doc.getElementById('menu-mob');
  function zamknij(){burger.setAttribute('aria-expanded','false');menu.hidden=true;doc.body.style.overflow='';}
  burger.addEventListener('click',function(){
    var otw=burger.getAttribute('aria-expanded')==='true';
    if(otw){zamknij();}else{burger.setAttribute('aria-expanded','true');menu.hidden=false;doc.body.style.overflow='hidden';}
  });
  menu.addEventListener('click',function(e){if(e.target.closest('a'))zamknij();});
  doc.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden)zamknij();});

  // przeciąganie myszą + blokada kliknięcia po przeciągnięciu
  function przeciaganie(el){
    var start=0,sl=0,akt=false,ruch=false;
    el.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse'||e.button!==0)return;
      akt=true;ruch=false;start=e.clientX;sl=el.scrollLeft;
    });
    window.addEventListener('pointermove',function(e){
      if(!akt)return;
      var dx=e.clientX-start;
      if(!ruch&&Math.abs(dx)>5){ruch=true;el.classList.add('ciagnie');}
      if(ruch){el.scrollLeft=sl-dx;e.preventDefault();}
    });
    window.addEventListener('pointerup',function(){
      if(!akt)return;akt=false;
      if(ruch){
        el.classList.remove('ciagnie');
        var w=el.firstElementChild?el.firstElementChild.getBoundingClientRect().width:el.clientWidth;
        var gap=parseFloat(getComputedStyle(el).columnGap)||0;
        var krok=w+gap;var i=Math.round(el.scrollLeft/krok);
        el.scrollTo({left:i*krok,behavior:'smooth'});
        setTimeout(function(){ruch=false;},0);
      }
    });
    el.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();}},true);
    el.addEventListener('dragstart',function(e){e.preventDefault();});
  }

  // karuzele w kartach produktów
  var strzL='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4 6.5 10l6 6"/></svg>';
  var strzP='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4l6 6-6 6"/></svg>';
  doc.querySelectorAll('[data-car]').forEach(function(car){
    var tor=car.querySelector('.car-tor'),imgs=tor.querySelectorAll('img');
    if(imgs.length<2)return;
    var kropki=doc.createElement('div');kropki.className='car-kropki';
    imgs.forEach(function(img,i){
      var b=doc.createElement('button');b.type='button';b.setAttribute('aria-label','Zdjęcie '+(i+1)+' z '+imgs.length);
      b.addEventListener('click',function(){tor.scrollTo({left:i*tor.clientWidth,behavior:'smooth'});});
      kropki.appendChild(b);
    });
    car.appendChild(kropki);
    var bl=doc.createElement('button');bl.type='button';bl.className='car-btn l';bl.setAttribute('aria-label','Poprzednie zdjęcie');bl.innerHTML=strzL;
    var bp=doc.createElement('button');bp.type='button';bp.className='car-btn p';bp.setAttribute('aria-label','Następne zdjęcie');bp.innerHTML=strzP;
    car.appendChild(bl);car.appendChild(bp);
    function nr(){return Math.round(tor.scrollLeft/tor.clientWidth);}
    function idz(k){var n=(nr()+k+imgs.length)%imgs.length;tor.scrollTo({left:n*tor.clientWidth,behavior:'smooth'});}
    bl.addEventListener('click',function(){idz(-1);});bp.addEventListener('click',function(){idz(1);});
    function odsw(){var n=nr();kropki.querySelectorAll('button').forEach(function(b,i){b.classList.toggle('on',i===n);});}
    tor.addEventListener('scroll',function(){window.requestAnimationFrame(odsw);},{passive:true});
    odsw();
    przeciaganie(tor);
  });

  // tor akcesoriów
  var tor=doc.getElementById('tor-akc');
  przeciaganie(tor);
  doc.querySelectorAll('.strz').forEach(function(b){
    b.addEventListener('click',function(){
      var w=tor.querySelector('.akc').getBoundingClientRect().width+20;
      tor.scrollBy({left:w*parseInt(b.dataset.kier,10),behavior:'smooth'});
    });
  });

  // aktywna pozycja menu = sekcja na ekranie
  var linki=doc.querySelectorAll('.nav a, .menu-mob nav a');
  var sekcje=['produkty','akcesoria','promocje','przedstawiciele','o-firmie','kontakt'].map(function(id){return doc.getElementById(id);});
  function aktywna(){
    var y=window.innerHeight*0.35,id='';
    sekcje.forEach(function(s){var r=s.getBoundingClientRect();if(r.top<=y&&r.bottom>y)id=s.id;});
    linki.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+id);});
  }
  window.addEventListener('scroll',function(){window.requestAnimationFrame(aktywna);},{passive:true});
  aktywna();

  // dolny pasek na telefonie dopiero po minięciu przycisku z pierwszego ekranu
  var pasek=doc.querySelector('.mob-pasek'),cta=doc.querySelector('.hero-akcje .btn'),kontakt=doc.getElementById('kontakt');
  if('IntersectionObserver' in window){
    var widacCta=true,widacKontakt=false;
    function ust(){var on=!widacCta&&!widacKontakt;pasek.classList.toggle('widac',on);pasek.setAttribute('aria-hidden',on?'false':'true');pasek.querySelectorAll('a').forEach(function(a){a.tabIndex=on?0:-1;});}
    new IntersectionObserver(function(e){widacCta=e[0].isIntersecting||e[0].boundingClientRect.top>0;ust();}).observe(cta);
    new IntersectionObserver(function(e){widacKontakt=e[0].isIntersecting;ust();},{rootMargin:'0px 0px -40% 0px'}).observe(kontakt);
  }

  // formularz pokazowy
  var form=doc.getElementById('form');
  form.addEventListener('submit',function(e){e.preventDefault();form.querySelector('.form-info').hidden=false;});
})();
