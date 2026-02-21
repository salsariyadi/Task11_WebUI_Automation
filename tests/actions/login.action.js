const { By, until } = require('selenium-webdriver');

const loginPage = require('../pageobjects/login.page');

class LoginAction {

    async login(driver, username, password) {

        const usernameField = await driver.wait(
            until.elementLocated(loginPage.usernameInput()),
            5000
        );

        await driver.wait(until.elementIsVisible(usernameField), 5000);
        await usernameField.clear();
        await usernameField.sendKeys(username);

        const passwordField = await driver.wait(
            until.elementLocated(loginPage.passwordInput()),
            5000
        );

        await driver.wait(until.elementIsVisible(passwordField), 5000);
        await passwordField.clear();
        await passwordField.sendKeys(password);

        const loginButton = await driver.wait(
            until.elementLocated(loginPage.loginButton()),
            5000
        );

        await driver.wait(until.elementIsEnabled(loginButton), 5000);
        await loginButton.click();
    }
}

module.exports = new LoginAction();