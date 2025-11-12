const puppeteer = require('puppeteer');
(async()=>{
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));

  try{
    await page.goto('http://127.0.0.1:8001', {waitUntil:'networkidle2'});
    console.log('Loaded home');
    // find first product card and long-press
    await page.waitForSelector('.card');
    const card = (await page.$$('.card'))[0];
    const box = await card.boundingBox();
    // pointerdown -> hold 700ms -> pointerup to trigger long-press
    await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
    await page.mouse.down();
    await page.waitForTimeout(700);
    // after hold, picker should appear; click last size button
    await page.mouse.up();
    await page.waitForSelector('#sizePicker', {timeout:2000});
    const btns = await page.$$('#sizePicker button');
    if(btns.length>0){ await btns[btns.length-1].click(); console.log('Clicked size'); }
    await page.waitForTimeout(300);
    // open cart drawer by clicking cartbar
    await page.click('#cartbar');
    await page.waitForSelector('#cartDrawer.open', {timeout:2000});
    console.log('Cart drawer opened');
    // apply promo via promo input on checkout page: navigate to checkout
    await page.evaluate(()=>{ window.openCartDrawer(); });
    await page.click('#cartDrawerFooter .btn.full'); // Go to checkout
    await page.waitForTimeout(500);
    // apply promo
    await page.waitForSelector('#promoCode');
    await page.type('#promoCode', 'DRIP10');
    await page.click('button[onclick*="applyPromoCode"]');
    await page.waitForTimeout(300);
    // save address
    await page.type('#f-name','E2E User');
    await page.type('#f-phone','07123456789');
    await page.type('#f-address','1 Testing Lane');
    await page.type('#f-postcode','SW1A1AA');
    await page.click('button[onclick*="saveAddress"]');
    await page.waitForTimeout(300);
    // place order
    const place = await page.$$('button.btn.full');
    if(place.length>0){ await place[place.length-1].click(); console.log('Clicked place order'); }
    await page.waitForTimeout(500);
    console.log('E2E flow completed');
  }catch(e){ console.error('E2E failed', e); process.exit(2);} finally{ await browser.close(); }
  process.exit(0);
})();
