const puppeteer = require("puppeteer")

exports.handler = async () => {
    const url = 'https://www.linkedin.com/';

    const profilesUrls = [
        'in/rajiaabdelaziz',
        'in/darian-bhathena',
        'in/danilolucari',
        'in/ngellner',
        'in/sixped',
        'in/davidezequielgranados',
        'in/andrejvajagic',
        'in/sahilbhatiya',
        'in/stenrs',
        'in/alexghattas',
    ];

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const navigationPromise = page.waitForNavigation()

    await page.goto(`https://www.linkedin.com/login`);
    await page.setViewport({width: 1366, height: 768});

    await navigationPromise

    await page.waitForSelector('#username')
    await page.type('#username', 'someacc@gmail.com');

    await page.waitForSelector('#password')
    await page.type('#password', 'some password');

    await page.waitForSelector('.card-layout > #organic-div > .login__form > .login__form_action_container > .btn__primary--large')
    await page.click('.card-layout > #organic-div > .login__form > .login__form_action_container > .btn__primary--large')

    await navigationPromise
    await page.waitForSelector('body')

    for (const profile of profilesUrls) {
        await page.goto(`${url}/${profile}`);
        await navigationPromise

        await page.waitForSelector('.pv-top-card-v2-ctas > .pvs-profile-actions > #ember68 > #ember69 > span')
        await page.click('.pv-top-card-v2-ctas > .pvs-profile-actions > #ember68 > #ember69 > span')

        await page.waitForSelector('.artdeco-dropdown__content-inner > ul > li > #ember73 > .display-flex')
        await page.click('.artdeco-dropdown__content-inner > ul > li > #ember73 > .display-flex')

        await page.waitForSelector('#ember222')
        await page.click('#ember222')

        await page.waitForSelector('#ember214 > .artdeco-modal > #ember224 > #ember225 > .artdeco-button__text')
        await page.click('#ember214 > .artdeco-modal > #ember224 > #ember225 > .artdeco-button__text')

        await page.waitForSelector('#ember214 > .artdeco-modal > #ember285 > #ember287 > .artdeco-button__text')
        await page.click('#ember214 > .artdeco-modal > #ember285 > #ember287 > .artdeco-button__text')

        const element = await page.waitForSelector('.ph5 > .mt2 > .pv-text-details__left-panel > div > h1.text-heading-xlarge');
        const fullName = await page.evaluate(element => element.textContent, element);

        await page.waitForSelector('#ember32');
        const imgSrc = await page.$eval('#ember32', (el) => el.getAttribute('src'));
    }

    await browser.close()
}
