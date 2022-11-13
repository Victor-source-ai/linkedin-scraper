const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Profile = require("./profile.schema");
dotenv.config();

const linkedInUrl = 'https://www.linkedin.com';
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

exports.handler = async () => {
    if (!mongoose.Mongoose.connection) {
        await mongoose
          .connect(process.env.MONGODB_URL, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
          })
          .then(() => {
              console.log("Connected to MongoDB");
          })
          .catch((err) => {
              console.log(err);
          });
    }

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const navigationPromise = page.waitForNavigation()

    await page.goto(`${linkedInUrl}/login`);
    await page.setViewport({width: 1366, height: 768});

    await navigationPromise

    await page.waitForSelector('#username')
    await page.type('#username', process.env.USER_LINKEDIN_EMAIL);

    await page.waitForSelector('#password')
    await page.type('#password', process.env.USER_LINKEDIN_PASSWORD);

    await page.waitForSelector('.card-layout > #organic-div > .login__form > .login__form_action_container > .btn__primary--large')
    await page.click('.card-layout > #organic-div > .login__form > .login__form_action_container > .btn__primary--large')

    await navigationPromise
    await page.waitForSelector('body')

    for (const profile of profilesUrls) {
        await page.goto(`${linkedInUrl}/${profile}`);
        await navigationPromise

        await page.waitForSelector(
          '.pv-top-card-v2-ctas > .pvs-profile-actions > .artdeco-dropdown > .pvs-overflow-actions-dropdown__content > .artdeco-dropdown__content-inner > ul > li'
        )

        const buttons = await page.$x('//*[contains(@class, "artdeco-button artdeco-button--2 artdeco-button--secondary ember-view")]');
        const addToContactButton = buttons[1];

        await addToContactButton.click();
        await navigationPromise

        const element = await page.waitForSelector('.ph5 > .mt2 > .pv-text-details__left-panel > div > h1.text-heading-xlarge');
        const fullName = await page.evaluate(element => element.textContent, element);

        await page.waitForSelector(
          '.pv-top-card--photo > .pv-top-card__non-self-photo-wrapper > button > img'
        );
        const imageUrl = await page.$eval(
          '.pv-top-card--photo > .pv-top-card__non-self-photo-wrapper > button > img',
          (el) => el.getAttribute('src')
        );

        createProfile({ fullName, imageUrl });
    }

    await browser.close()
}

function createProfile(profileInfo) {
    const todo = new Profile({
        fullName: profileInfo.fullName,
        imageUrl: profileInfo.imageUrl,
    });

    todo.save((err, todo) => {
        if (err) {
            console.log(err);
        }
        console.log('Saved');
    });
}
