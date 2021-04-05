const { chromium } = require('playwright');
require('dotenv').config();

(async () => {
  const browser = await chromium.launch({
    headless: false
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

  await page.goto(process.env.URL);
  await page.click('text=閉じる');
  await page.waitForSelector(".survey-result-and-improvement-release-information-modal",{state: "detached"});

  const element = await page.$('#inner-scroll')
  await scrollFullPage(page, element);
  await element.screenshot({
      fullPage: true,
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
