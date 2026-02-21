const fs = require('fs');
const path = require('path');

class ScreenshotAction {

    async takeScreenshot(driver, filePath) {

        const dir = path.dirname(filePath);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const image = await driver.takeScreenshot();
        fs.writeFileSync(filePath, image, 'base64');
    }
}

module.exports = new ScreenshotAction();