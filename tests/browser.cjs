const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const script=fs.readFileSync('pride-flag-highlighter.user.js','utf8');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{for(const site of ['manapool','scryfall','steamgifts']){
  const context=await browser.newContext({viewport:{width:1000,height:900}});
  await context.route(`https://${site}.com/**`,r=>r.fulfill({contentType:'text/html',headers:site==='scryfall'?{'Content-Security-Policy':"style-src 'self'; img-src 'self' data:"}:{},body:'<style>button,select,input{background:white!important;color:white!important;padding:50px!important}aside,section{display:inline!important}label{color:red!important}</style><p id="words">lesbian gay bisexual transgender</p>'}));
  await context.addInitScript({content:script});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`https://${site}.com/`);
  const fab=page.getByRole('button',{name:'Prism Pride Highlighter settings',exact:true});await fab.click();
  const panel=page.getByRole('dialog');assert.equal(await panel.locator('[type=checkbox]').count(),0);
  assert.equal(await fab.locator('svg').count(),1);
  assert.equal((await panel.boundingBox()).width,312);
  assert.equal(await panel.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(40, 40, 38)');
  await page.locator('.pph-hit').first().waitFor();
  const enable=panel.getByRole('switch',{name:'Enable highlighting',exact:true});await enable.click();assert.equal(await enable.getAttribute('aria-checked'),'false');assert.equal(await page.locator('.pph-hit').count(),0);
  await enable.press('Space');assert.equal(await enable.getAttribute('aria-checked'),'true');assert(await page.locator('.pph-hit').count()>0);
  await panel.getByRole('button',{name:'Underline',exact:true}).click();assert.equal(await page.locator('.pph-hit').first().getAttribute('data-style'),'underline');
  await panel.getByText('Performance & accessibility',{exact:true}).click();
  for(const name of ['Reduce motion','High contrast']){const sw=panel.getByRole('switch',{name,exact:true});await sw.click();assert.equal(await sw.getAttribute('aria-checked'),'true');assert.equal((await sw.boundingBox()).width,36);}
  assert.equal(await panel.getByRole('switch',{name:'High contrast',exact:true}).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
  assert.equal(await enable.evaluate(el=>getComputedStyle(el,'::after').transitionDuration),'0s');
  await panel.getByText('Flag visibility',{exact:true}).click();await panel.getByRole('searchbox').fill('lesbian');
  const flag=panel.getByRole('switch',{name:'Show Lesbian',exact:true});await flag.click();assert.equal(await flag.getAttribute('aria-checked'),'false');
  await page.reload();await fab.click();await panel.getByText('Flag visibility',{exact:true}).click();assert.equal(await panel.getByRole('switch',{name:'Show Lesbian',exact:true}).getAttribute('aria-checked'),'false');
  await panel.getByRole('button',{name:'Reset defaults',exact:true}).click();assert.equal(await panel.getByRole('switch',{name:'Show Lesbian',exact:true}).getAttribute('aria-checked'),'true');
  await page.emulateMedia({reducedMotion:'reduce',contrast:'more'});
  assert.equal(await enable.evaluate(el=>getComputedStyle(el,'::after').transitionDuration),'0s');
  assert.equal(await enable.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
  await page.emulateMedia({reducedMotion:'no-preference',contrast:'no-preference'});
  // Theme Picker docks its recognized companion host, without entering the shadow root.
  await page.locator('.pfh-fab').evaluate(el=>{el.style.setProperty('right','80px','important');});
  await page.waitForTimeout(50);assert.equal((await fab.boundingBox()).x,872);
  await page.setViewportSize({width:360,height:640});await page.waitForTimeout(100);const bounds=await panel.boundingBox();assert(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=360&&bounds.y+bounds.height<=640);
  fs.mkdirSync('test-results',{recursive:true});await page.screenshot({path:`test-results/${site}.png`});
  await page.keyboard.press('Escape');assert.equal(await panel.isVisible(),false);assert.deepEqual(errors,[]);
  console.log(`${site}: isolated menu, CSP, switches, highlighting, persistence, reset and mobile passed`);await context.close();
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
