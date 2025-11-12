const fs = require('fs');
const path = require('path');
const {JSDOM, VirtualConsole} = require('jsdom');

(async function(){
  const html = fs.readFileSync(path.resolve(__dirname,'..','index.html'),'utf8');
  const vconsole = new VirtualConsole();
  const errors = [];
  vconsole.on('error', (msg) => { errors.push({type:'error',msg}); console.error('VC error',msg); });
  vconsole.on('log', (msg) => { console.log('VC log', msg); });

  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', virtualConsole: vconsole, url: 'http://localhost:8001/' });
  const {window} = dom;
  // stub fetch to avoid network calls
  window.fetch = (...args)=> Promise.resolve({ ok:true, json: async ()=>({ok:true}), text: async ()=>'' });
  window.alert = (m)=>{ console.log('ALERT:', m); };

  // wait for app to initialize (wait until window.state is present)
  await new Promise((res, rej)=>{
    let checks = 0; const iv = setInterval(()=>{
      try{ if(window && window.eval && window.eval('typeof state !== "undefined"')){ clearInterval(iv); return res(); } }
      catch(e){}
      checks++; if(checks>60){ clearInterval(iv); return res(); }
    }, 100);
  });

  try{
    console.log('Starting smoke actions...');
    // 1) Quick-add using size picker: call showSizePicker and then click first size button
    if(typeof window.showSizePicker === 'function'){
      console.log('Invoking showSizePicker for g1');
      window.showSizePicker('g1', window.document.querySelector('.card'));
      await new Promise(r=>setTimeout(r,100));
      const picker = window.document.getElementById('sizePicker');
      if(!picker) throw new Error('sizePicker not found');
      // pick the last button (size buttons are after the close button)
      const btns = picker.querySelectorAll('button');
      const btn = btns[btns.length-1];
      if(!btn) throw new Error('size button not found');
      btn.click();
      await new Promise(r=>setTimeout(r,100));
      const state = window.eval('state');
      console.log('Cart after quick-add:', state.cart);
    } else {
      console.warn('showSizePicker not available');
    }

    // 2) Open cart drawer
    console.log('Opening cart drawer');
    window.openCartDrawer();
    await new Promise(r=>setTimeout(r,100));
    const drawerBody = window.document.getElementById('cartDrawerBody');
    if(!drawerBody) throw new Error('cartDrawerBody missing');
    console.log('Drawer content length:', drawerBody.innerHTML.length);

    // 3) Apply promo
    console.log('Applying promo DRIP10');
    if(typeof window.applyPromoCode === 'function'){
      window.applyPromoCode('DRIP10');
      await new Promise(r=>setTimeout(r,100));
      const state = window.eval('state');
      console.log('Promo state:', state.promo);
    }

    // 4) Go to checkout
    console.log('Navigating to checkout');
    window.go('checkout');
    await new Promise(r=>setTimeout(r,300));
    const stateNow = window.eval('state');
    console.log('Current route:', stateNow.route.name);

    // 5) Fill and save address
    console.log('Filling address fields');
    const setVal = (id,v) => { const el = window.document.getElementById(id); if(el){ el.value = v; el.dispatchEvent(new window.Event('input')); } };
    setVal('f-name','Test User'); setVal('f-phone','07123456789'); setVal('f-email','test@example.com'); setVal('f-address','123 Test St'); setVal('f-city','London'); setVal('f-postcode','SW1A1AA');
    if(typeof window.saveAddress === 'function'){
      window.saveAddress();
      await new Promise(r=>setTimeout(r,100));
      console.log('Saved addresses:', window.eval('load("addresses", [])'));
    }

    // 6) Place order (simulate clicking place order button)
    console.log('Placing order');
    // find a button that looks like the final place-order button
    const fullBtns = Array.from(window.document.querySelectorAll('button.btn.full')) || [];
    let placeBtn = fullBtns.find(b=>/place order/i.test(b.textContent)) || fullBtns[fullBtns.length-1];
    if(placeBtn){ placeBtn.click(); await new Promise(r=>setTimeout(r,300)); const st = window.eval('state'); console.log('Order state:', st.order? st.order.id : 'no-order'); }
    else console.warn('Place order button not found');

  }catch(err){ console.error('Smoke test error', err); errors.push({type:'smoke',err: String(err)}); }

  // collect console errors from window
  const winErrors = window._vm_errors || [];
  if(errors.length) console.log('Errors captured:', errors);
  else console.log('No runtime errors captured by virtual console.');

  // print any window console messages
  console.log('Done smoke test.');
  process.exit(errors.length?1:0);

})();
