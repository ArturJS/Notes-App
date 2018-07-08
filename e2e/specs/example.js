const path = require('path');

const screenshotPath = browser => {
    const dateTime = new Date()
        .toISOString()
        .split('.')[0]
        .replace(/:/g, '-');
    const fileName = `${browser.currentTest.module}-${dateTime}.png`;

    return path.resolve(
        path.join(
            browser.globals.test_settings.screenshots.path || '',
            fileName
        )
    );
};

module.exports = {
    'sample test': browser => {
        browser
            .url(browser.launch_url)
            .pause(5000)
            .saveScreenshot(screenshotPath(browser))
            .end();
    }
};
