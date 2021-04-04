const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });
  const context = await browser.newContext();
  // Open new page
  const page = await context.newPage();
  await page.setViewportSize({width: 1500, height: 4000});

  // Go to https://motivation-cloudapp.com/users/sign_in
  await page.goto('https://motivation-cloudapp.com/users/sign_in');
  // Fill [placeholder="メールアドレス"]
  await page.fill('[placeholder="メールアドレス"]', process.env.EMAIL);
  // Fill [placeholder="パスワード"]
  await page.fill('[placeholder="パスワード"]', process.env.PASSWORD);
  // Click input:has-text("ログイン")
  await page.click('input:has-text("ログイン")');

  await page.goto('https://motivation-cloudapp.com/companies/775/surveys/6249/improvements/results/1315967');
  await page.click('text=閉じる');
  await page.waitForSelector(".survey-result-and-improvement-release-information-modal",{state: "detached"});
  //page.waitForNavigation(/*{ url: 'https://motivation-cloudapp.com/companies/775/surveys/6249/results' }*/),
  //await page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: 5000})
  //await page.pause(); 

  const element = await page.$('#inner-scroll')
  await scrollFullPage(page, element);
  await element.screenshot({
    clip: {width: 1000, height: 3000, x: 1000, y: 3000}, fullPage: true,
      path: 'a.jpg'
      });

  // ---------------------
  await context.close();
  await browser.close();
})();
async function scrollFullPage(page, element) {
  await page.evaluate(([e]) => {
    return Promise.resolve(e.scrollTo(0, e.scrollHeight))
  }, [element]);
}
//async function scrollFullPage(page) {
//  await page.evaluate(async () => {
//    await new Promise(resolve => {
//      let totalHeight = 0;
//      const distance = 100;
//      const timer = setInterval(() => {
//        const scrollHeight = document.body.scrollHeight;
//        window.scrollBy(0, distance);
//        totalHeight += distance;
//        
//        if (totalHeight >= scrollHeight){
//          clearInterval(timer);
//          resolve();
//        }
//      }, 100);
//    });
//  });
//}
async function scrollToBottom(element, viewportHeight) {
  const getScrollHeight = () => {
    return Promise.resolve(document.documentElement.scrollHeight) }

  let scrollHeight = await page.evaluate(getScrollHeight)
  let currentPosition = 0
  let scrollNumber = 0

  while (currentPosition < scrollHeight) {
    scrollNumber += 1
    const nextPosition = scrollNumber * viewportHeight
    await page.evaluate(function (scrollTo) {
      return Promise.resolve(window.scrollTo(0, scrollTo))
    }, nextPosition)
    await page.waitForNavigation({waitUntil: 'networkidle2', timeout: 5000})
              .catch(e => console.log('timeout exceed. proceed to next operation'));

    currentPosition = nextPosition;
    console.log(`scrollNumber: ${scrollNumber}`)
    console.log(`currentPosition: ${currentPosition}`)

    // 2
    scrollHeight = await page.evaluate(getScrollHeight)
    console.log(`ScrollHeight ${scrollHeight}`)
  }
}
//const { chromium } = require('playwright');
//(async () => {
//  const browser = await chromium.launch({
//    headless: false
//  });
//  const context = await browser.newContext();
//  // Open new page
//  const page = await context.newPage();
//  // Go to https://motivation-cloudapp.com/users/sign_in
//  await page.goto('https://motivation-cloudapp.com/users/sign_in');
//  // Click [placeholder="メールアドレス"]
//  await page.click('[placeholder="メールアドレス"]');
//  // Fill [placeholder="メールアドレス"]
//  await page.fill('[placeholder="メールアドレス"]', 'egami.masato@lmi.ne.jp');
//  // Press Tab
//  await page.press('[placeholder="メールアドレス"]', 'Tab');
//  // Fill [placeholder="パスワード"]
//  await page.fill('[placeholder="パスワード"]', '2Gyouza7');
//  // Click input:has-text("ログイン")
//  await page.click('input:has-text("ログイン")');
//  // assert.equal(page.url(), 'https://motivation-cloudapp.com/operations/companies/230/magellan_operation_menu');
//  // Click text=結果・改善
//  await page.click('text=結果・改善');
//  // assert.equal(page.url(), 'https://motivation-cloudapp.com/companies/230/surveys/6338/results');
//  // Click text=閉じる
//  await page.click('text=閉じる');
//  // Click img[alt="Motivation Cloud"]
//  await page.click('img[alt="Motivation Cloud"]');
//  // assert.equal(page.url(), 'https://motivation-cloudapp.com/companies');
//  // Click text=LMI 組織デザイン室 - - - - - - - >> span
//  await Promise.all([
//    page.waitForNavigation(/*{ url: 'https://motivation-cloudapp.com/companies/775/surveys/6249/results' }*/),
//    page.click('text=LMI 組織デザイン室 - - - - - - - >> span')
//  ]);
//  // Click #inner-scroll >> text=BDU-エンジニアリング1G
//  await page.click('#inner-scroll >> text=BDU-エンジニアリング1G');
//  // assert.equal(page.url(), 'https://motivation-cloudapp.com/companies/775/surveys/6249/results/1315967');
//  // Click #surveys-header a:has-text("改善")
//  await page.click('#surveys-header a:has-text("改善")');
//  // assert.equal(page.url(), 'https://motivation-cloudapp.com/companies/775/surveys/6249/improvements/results/1315967');
//  // ---------------------
//  await context.close();
//  await browser.close();
//})();
