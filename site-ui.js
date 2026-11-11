(()=>{
  const LANGS=['en','ru','es','de'];
  const labels={en:{light:'Light theme',dark:'Dark theme'},ru:{light:'Светлая тема',dark:'Тёмная тема'},es:{light:'Tema claro',dark:'Tema oscuro'},de:{light:'Helles Design',dark:'Dunkles Design'}};
  const saved=localStorage.getItem('site-theme');
  const applyTheme=(v)=>{document.documentElement.dataset.theme=v;localStorage.setItem('site-theme',v);const b=document.querySelector('[data-theme-toggle]');if(b){b.textContent=v==='dark'?'☀':'☾';b.setAttribute('aria-label',labels[document.documentElement.lang]?.[v==='dark'?'light':'dark']||'Toggle theme');b.title=labels[document.documentElement.lang]?.[v==='dark'?'light':'dark']||'Toggle theme';}};
  if(saved)document.documentElement.dataset.theme=saved;
  function addTheme(){
    const host=document.querySelector('.header-tools,.header-actions,.navright');
    if(!host||host.querySelector('[data-theme-toggle]'))return;
    const b=document.createElement('button');b.type='button';b.className='theme-toggle';b.dataset.themeToggle='1';b.textContent=document.documentElement.dataset.theme==='dark'?'☀':'☾';b.setAttribute('aria-label','Toggle theme');b.title='Toggle theme';b.addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
    const lang=host.querySelector('select,button.language-button,.lang');
    if(lang)lang.insertAdjacentElement('afterend',b);else host.appendChild(b);
    applyTheme(document.documentElement.dataset.theme||document.body.dataset.defaultTheme||'light');
  }
  function ensureLogo(){
    const lang=(document.documentElement.lang||'en').slice(0,2);
    document.querySelectorAll('header .logo,header .wordmark,footer .logo,footer .wordmark').forEach(a=>{
      if(a.tagName==='A'){a.setAttribute('href',`/${LANGS.includes(lang)?lang:'en'}/`);if(!a.dataset.homeBound){a.dataset.homeBound='1';a.addEventListener('click',e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const here=location.pathname.split('/').filter(Boolean);const l=LANGS.includes(here[0])?here[0]:lang;e.preventDefault();location.href=`/${l}/`;});}}
    });
  }
  function localeChange(sel){
    const next=sel.value;if(!LANGS.includes(next))return;
    const parts=location.pathname.split('/').filter(Boolean);
    const old=LANGS.includes(parts[0])?parts.shift():null;
    const rest=parts;
    const target=`/${next}/${rest.join('/')}${rest.length?'/':''}${location.search}${location.hash}`;
    localStorage.setItem('site-lang',next);
    location.href=target;
  }
  function bindLanguage(){
    document.addEventListener('change',e=>{
      const s=e.target.closest('#language,.lang,select.language-select');
      if(!s)return;
      // Let the site-specific language handler run for FORM; other selectors are normalized here.
      if(document.body.dataset.site==='forma')return;
      e.stopImmediatePropagation();localeChange(s);
    },true);
  }
  function boot(){addTheme();ensureLogo();bindLanguage();
    const mo=new MutationObserver(()=>{addTheme();ensureLogo();});mo.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('popstate',()=>{setTimeout(()=>{addTheme();ensureLogo();},0)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();