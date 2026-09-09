const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const script=fs.readFileSync('pride-flag-highlighter.user.js','utf8');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{for(const site of ['manapool','scryfall','steamgifts']){
  const context=await browser.newContext({viewport:{width:1000,height:900}});
  await context.route(`https://${site}.com/**`,r=>r.fulfill({contentType:'text/html',headers:site==='scryfall'?{'Content-Security-Policy':"style-src 'self'; img-src 'self' data:"}:{},body:'<style>button,select,input{background:white!important;color:white!important;padding:50px!important}aside,section{display:inline!important}label{color:red!important}</style><p id="words">lesbian gay bisexual transgender pansexual asexual aromantic pride flag bear pride leather pride straight ally</p><p id="ordinary">Take pride in work. The bear walked. I am an ally. trans fat. ace of spades. bi pan aro leather poly.</p>'}));
  if(site==='steamgifts')await context.addInitScript(()=>{Object.defineProperty(window,'CSSStyleSheet',{value:undefined,configurable:true});});
  await context.addInitScript({content:script});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`https://${site}.com/`);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('prism.pride-highlighter.settings')).schemaVersion),1,'settings migrate to schema 1');
  const fab=page.getByRole('button',{name:'Prism Pride Highlighter settings',exact:true});
  await page.waitForFunction(()=>document.getElementById('__prism_pride_highlighter_v2')?.dataset.launcherOccupiedArea);const declaration=await page.locator('#__prism_pride_highlighter_v2').evaluate(el=>({...el.dataset}));assert.equal(declaration.userscriptLauncher,'userscript-launcher-v1');assert.equal(declaration.launcherOwner,'expDARE');assert.equal(declaration.launcherPriority,'50');assert.equal(declaration.launcherPreferredPosition,'right-bottom');assert.doesNotThrow(()=>JSON.parse(declaration.launcherOccupiedArea));
  const beforeDrag=await fab.boundingBox();await page.mouse.move(beforeDrag.x+24,beforeDrag.y+24);await page.mouse.down();await page.mouse.move(beforeDrag.x+24,beforeDrag.y-28,{steps:4});await page.mouse.up();const afterDrag=await fab.boundingBox();assert(Math.abs(afterDrag.x-beforeDrag.x)<1,'vertical drag must preserve horizontal position');
  await fab.click();
  const panel=page.getByRole('dialog');assert.equal(await panel.locator('[type=checkbox]').count(),0);
  assert.equal(await panel.getByText('v2.1.7',{exact:true}).count(),1);
  await panel.getByText('About & diagnostics',{exact:true}).click();assert.match(await panel.locator('#pph-diagnostics').textContent(),/Prism Pride Highlighter 2\.1\.7[\s\S]*Active identities:/);
  assert.equal(await fab.locator('svg').count(),1);
  assert.equal((await panel.boundingBox()).width,312);
  assert.equal(await panel.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(40, 40, 38)');
  await page.locator('.pph-hit').first().waitFor();
  assert.equal(await page.locator('#ordinary .pph-hit').count(),0,'ambiguous bare words must not highlight');
  for(const phrase of ['pride flag','bear pride','leather pride','straight ally'])assert.equal(await page.locator('.pph-hit',{hasText:phrase}).count(),1,`${phrase} should remain an explicit match`);
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
  await panel.getByText('Settings backup',{exact:true}).click();
  await panel.getByRole('button',{name:'Export',exact:true}).click();await panel.getByText('Settings exported',{exact:true}).waitFor();
  await panel.locator('#pph-import-file').setInputFiles({name:'settings.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({settings:{style:'background',highContrast:true}}))});
  await panel.getByText('Settings imported',{exact:true}).waitFor();assert.equal(await panel.getByLabel('Highlight style').inputValue(),'background');await panel.getByText('Performance & accessibility',{exact:true}).click();assert.equal(await panel.getByRole('switch',{name:'High contrast',exact:true}).getAttribute('aria-checked'),'true');
  await page.emulateMedia({reducedMotion:'reduce',contrast:'more'});
  assert.equal(await enable.evaluate(el=>getComputedStyle(el,'::after').transitionDuration),'0s');
  assert.equal(await enable.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
  await page.emulateMedia({reducedMotion:'no-preference',contrast:'no-preference'});
  // Theme Picker docks its recognized companion host, without entering the shadow root.
  await page.locator('.pfh-fab').evaluate(el=>{el.style.setProperty('right','80px','important');});
  await page.waitForTimeout(50);assert.equal((await fab.boundingBox()).x,872);
  await page.setViewportSize({width:360,height:640});await page.waitForTimeout(100);const bounds=await panel.boundingBox();assert(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=360&&bounds.y+bounds.height<=640);
  fs.mkdirSync('test-results',{recursive:true});await page.screenshot({path:`test-results/${site}.png`});
  await page.keyboard.press('Escape');assert.equal(await panel.isVisible(),false);await page.keyboard.press('Alt+g');assert.equal(await panel.isVisible(),true);await panel.getByText('Performance & accessibility',{exact:true}).evaluate(summary=>{summary.parentElement.open=true;});const shortcutInput=panel.getByRole('textbox',{name:'Open menu shortcut',exact:true});await shortcutInput.fill('Alt+P');await shortcutInput.press('Tab');await page.keyboard.press('Escape');await page.keyboard.press('Alt+g');assert.equal(await panel.isVisible(),false);await page.keyboard.press('Alt+p');assert.equal(await panel.isVisible(),true);assert.deepEqual(errors,[]);
  console.log(`${site}: menu, CSP, matching, switches, backup, shortcut, persistence, reset and mobile passed`);await context.close();
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
