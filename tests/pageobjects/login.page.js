const { By } = require('selenium-webdriver');

class LoginPage {

    usernameInput() {
        return By.id('user-name');
    }

    passwordInput() {
        return By.id('password');
    }

    loginButton() {
        return By.id('login-button');
    }

    errorMessage() {
        return By.css('[data-test="error"]');
    }

    appLogo() {
        return By.className('app_logo');
    }
}

module.exports = new LoginPage();