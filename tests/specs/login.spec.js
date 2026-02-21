require('chromedriver');

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');

const loginAction = require('../actions/login.action');

describe('Login Test POM + Visual Regression', function () {

    this.timeout(60000);
    let driver;

    before(async function () {

        const options = new chrome.Options();

        options.addArguments(
            '--incognito',
            '--disable-notifications',
            '--disable-infobars',
            '--disable-save-password-bubble',
            '--disable-features=PasswordLeakDetection',
            '--disable-popup-blocking',
            '--start-maximized'
        );

        options.setUserPreferences({
            'credentials_enable_service': false,
            'profile.password_manager_enabled': false
        });

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.manage().window().setRect({ width: 1280, height: 800 });
    });

    beforeEach(async function () {
        await driver.get('https://www.saucedemo.com');
    });

    after(async function () {
        await driver.quit();
    });

    function ensureFolders() {
        const dirs = [
            'screenshot',
            'screenshot/baseline',
            'screenshot/current'
        ];

        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });
    }

    async function takeScreenshot(testName) {
        ensureFolders();

        const baseline = `screenshot/baseline/${testName}.png`;
        const current = `screenshot/current/${testName}.png`;

        const image = await driver.takeScreenshot();
        fs.writeFileSync(current, image, 'base64');

        if (!fs.existsSync(baseline)) {
            fs.copyFileSync(current, baseline);
        }
    }

     
    // POSITIVE LOGIN
     
    it('Positive Login', async function () {

        await loginAction.login(driver, 'standard_user', 'secret_sauce');

        const logo = await driver.wait(
            until.elementLocated(By.className('app_logo')),
            5000
        );

        const text = await logo.getText();
        assert.strictEqual(text, 'Swag Labs');

        await takeScreenshot('positive_login');
    });

     
    // INVALID USERNAME
     
    it('Invalid Username', async function () {

        await loginAction.login(driver, 'wrong_user_123', 'secret_sauce');

        const error = await driver.wait(
            until.elementLocated(By.css('[data-test="error"]')),
            5000
        );

        assert.ok(await error.isDisplayed());

        await takeScreenshot('invalid_username');
    });
    // WRONG PASSWORD
    it('Wrong Password', async function () {

        await loginAction.login(driver, 'standard_user', 'wrong_pass');

        const error = await driver.wait(
            until.elementLocated(By.css('[data-test="error"]')),
            5000
        );

        assert.ok(await error.isDisplayed());

        await takeScreenshot('wrong_password');
    });

     
    // LOCKED USER
     
    it('Locked Out User', async function () {

        await loginAction.login(driver, 'locked_out_user', 'secret_sauce');

        const error = await driver.wait(
            until.elementLocated(By.css('[data-test="error"]')),
            5000
        );

        assert.ok(await error.isDisplayed());

        await takeScreenshot('locked_user');
    });

});